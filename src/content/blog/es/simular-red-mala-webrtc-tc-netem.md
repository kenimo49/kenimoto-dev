---
title: "Simular una red mala en tus pruebas E2E de WebRTC: pérdida de paquetes con tc/netem, sin infraestructura cara"
description: "Tus pruebas E2E pasan en verde, pero el video se entrecorta en producción. Te muestro por qué CDP no alcanza y cómo inyectar pérdida de paquetes con tc/netem desde Docker."
date: 2026-06-23
lang: es
tags: [webrtc, testing, e2e, playwright, netem]
featured: false
canonical_url: "https://kenimoto.dev/es/blog/simular-red-mala-webrtc-tc-netem/"
og_image: "https://kenimoto.dev/images/blog/simular-red-mala-webrtc-tc-netem/og-es.png"
cross_posted_to: []
---

Durante un tiempo creí que tener la suite E2E en verde era una especie de seguro de vida. Todo pasaba, yo cerraba la computadora tranquilo, y al día siguiente un usuario me escribía: "la llamada se ve a cuadritos". Mi reacción favorita era abrir el dashboard de pruebas, señalarlo con el dedo y decir "pero acá está todo verde". Spoiler: al usuario no le importa tu dashboard.

El problema no era que las pruebas estuvieran mal escritas. El problema era que probaban la cosa equivocada.

![Qué prueba cada herramienta de red: CDP sobre TCP frente a tc/netem sobre UDP](/images/blog/simular-red-mala-webrtc-tc-netem/og-es.png)

## Antes de empezar: esto no es otro artículo de latencia

Si seguiste lo que vengo escribiendo, ya hablé de [la anatomía de los 300 ms de latencia en voz](/es/blog/anatomia-latencia-voz-300ms/), que es el desglose interno del pipeline de audio. Y también de [pruebas LLMO con Playwright para rastreadores](/es/blog/tests-llmo-playwright-crawlers/), que mide si los crawlers leen tu página.

Este es otro animal. Acá el tema es la **calidad de la transmisión de medios cuando la red está mala**: pérdida de paquetes, retraso, jitter. No el pipeline interno, no los crawlers. La red horrible del usuario que está en el metro con dos rayitas de señal.

## Por qué tu prueba de red miente

WebRTC tiene dos planos que viajan por caminos distintos. La señalización (negociar la llamada, intercambiar SDP) va por WebSocket, o sea TCP. El video y el audio van por RTP sobre UDP. Son dos mundos.

Acá está la trampa. Cuando usas el Chrome DevTools Protocol para simular una red mala con `Network.emulateNetworkConditions`, eso solo afecta al tráfico **TCP**. HTTP, WebSocket, las llamadas a tu API. El video RTP sobre UDP pasa de largo como si nada.

Lo escribo claro porque a mí me costó días entenderlo:

| Herramienta | Protocolo | Sí funciona en | No funciona en |
|---|---|---|---|
| CDP `emulateNetworkConditions` | HTTP / WebSocket (TCP) | retraso de señalización, latencia de API | video y audio RTP |
| Linux `tc`/`netem` | todo (TCP + UDP) | RTP, candidatos ICE, señalización | nada, le pega a todo |

Entonces sí, tu prueba de "red lenta" con CDP corre, pasa, se pone verde. Y no tocó ni un solo paquete de video. Es como probar los frenos de un auto soplándole a las ruedas.

## CDP todavía sirve para algo

No quiero que tires CDP a la basura. Para lo que es TCP, está perfecto. Por ejemplo, verificar que tu app muestra un indicador de carga cuando la señalización se demora:

```typescript
test('muestra indicador de carga cuando la señalización se retrasa', async ({ callerPage }) => {
  const cdp = await callerPage.context().newCDPSession(callerPage);

  // Inyectar 300ms de retraso al WebSocket de señalización
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 300,
    downloadThroughput: -1,
    uploadThroughput: -1,
  });

  await callerPage.goto('http://localhost:3000');
  await callerPage.fill('[data-testid="room-input"]', 'test-room');
  await callerPage.click('[data-testid="join-button"]');

  // Durante el retraso, debe verse la UI de carga
  await callerPage.waitForSelector('[data-testid="loading-indicator"]', {
    timeout: 5000,
  });
});
```

Esto vale. Pero hasta acá llega CDP. Para que el video se entrecorte de verdad necesitamos bajar al kernel.

## tc/netem: el simulador de redes que ya tienes instalado

`tc` (traffic control) es una herramienta del kernel de Linux. Combinada con el módulo `netem` (network emulator), te deja inyectar pérdida de paquetes, retraso y límite de banda sobre un puerto o protocolo específico. Lo mejor: no compras nada. Ni un equipo, ni un router de pruebas, ni un servicio en la nube. Está ahí, gratis, esperando que lo uses.

La industria coincide en que WebRTC es brutalmente sensible a la pérdida y al jitter, mucho antes de que el ancho de banda sea el cuello de botella. El protocolo está diseñado para el rango de 0 a 3% de pérdida; al pasar el 5% conviene revisar la ruta de red en lugar de seguir ajustando el codec. O sea: si no pruebas con pérdida real, no pruebas nada parecido a la vida del usuario.

### El permiso que necesitas

`tc` no corre sin `NET_ADMIN`. En tu `docker-compose` lo agregas con `cap_add`:

```yaml
# docker-compose.e2e.yml
services:
  e2e:
    build:
      context: .
      dockerfile: Dockerfile.e2e
    depends_on:
      - app
    shm_size: '2gb'
    cap_add:
      - NET_ADMIN   # necesario para ejecutar tc
    environment:
      - BASE_URL=http://app:3000
```

### Encontrar el puerto correcto

Acá está la parte elegante. No queremos degradar todo el tráfico del contenedor, queremos degradar **solo** los medios y dejar la señalización TCP intacta. Para eso necesitamos el puerto UDP que WebRTC eligió.

Ese puerto sale de `getStats()`, mirando el par de candidatos que ganó la negociación ICE:

```typescript
// Obtener el puerto UDP local que usa WebRTC
async function getWebRTCLocalPort(page: Page): Promise<number | null> {
  return page.evaluate(async () => {
    const pc = (window as any).__rtcPeerConnection as RTCPeerConnection;
    if (!pc) return null;

    const stats = await pc.getStats();
    let localPort: number | null = null;

    stats.forEach((report) => {
      // El par de candidatos exitoso nos da el puerto local
      if (report.type === 'candidate-pair' && report.state === 'succeeded') {
        const localCandidateId = report.localCandidateId;
        stats.forEach((candidate) => {
          if (candidate.id === localCandidateId && candidate.type === 'local-candidate') {
            localPort = candidate.port;
          }
        });
      }
    });

    return localPort;
  });
}
```

### Inyectar la pérdida solo en ese puerto

Con el puerto en la mano, aplicamos `tc` filtrando por UDP (protocolo IP 17) y por puerto de destino:

```typescript
import { execSync } from 'child_process';

// Configurar pérdida de paquetes con netem
function applyPacketLoss(port: number, lossPercent: number) {
  // Limpiar reglas previas
  try { execSync('tc qdisc del dev eth0 root 2>/dev/null'); } catch {}

  // netem solo sobre el puerto UDP indicado
  execSync(`tc qdisc add dev eth0 root handle 1: prio`);
  execSync(
    `tc qdisc add dev eth0 parent 1:3 handle 30: netem loss ${lossPercent}%`
  );
  execSync(
    `tc filter add dev eth0 protocol ip parent 1:0 prio 3 ` +
    `u32 match ip dport ${port} 0xffff match ip protocol 17 0xff flowid 1:3`
  );
}

function clearNetworkRules() {
  try { execSync('tc qdisc del dev eth0 root 2>/dev/null'); } catch {}
}
```

El `match ip protocol 17` significa UDP. El `match ip dport` apunta al puerto que sacamos de ICE. Resultado: la señalización TCP sigue impecable y solo el video sufre. Cirugía con bisturí, no con motosierra.

### Presets para no inventar números cada vez

En lugar de recordar de memoria qué porcentaje de pérdida corresponde a "Wi-Fi de café", define presets con nombre. Tu yo del futuro te lo va a agradecer:

```typescript
// fixtures/tc-network-presets.ts

export type TCPreset = {
  loss?: number;       // pérdida de paquetes (%)
  delay?: number;      // retraso extra (ms)
  rate?: string;       // límite de banda (ej: "500kbit")
  jitter?: number;     // variación del retraso (ms)
};

export const TCPresets: Record<string, TCPreset> = {
  /** Pérdida 10% (Wi-Fi inestable) */
  unstableWifi: { loss: 10, delay: 20 },

  /** Pérdida 30% (muy inestable) */
  veryUnstable: { loss: 30, delay: 50 },

  /** Banda 500kbps (tipo 3G) */
  slow3g: { rate: '500kbit', delay: 100 },

  /** Retraso alto 300ms (entre oficinas lejanas) */
  highLatency: { delay: 300, jitter: 50 },

  /** Banda 100kbps + pérdida 5% (el límite) */
  extreme: { rate: '100kbit', loss: 5, delay: 200 },
};
```

La función que arma el comando `netem` a partir del preset:

```typescript
function applyTCPreset(port: number, preset: TCPreset) {
  try { execSync('tc qdisc del dev eth0 root 2>/dev/null'); } catch {}

  const netemOpts: string[] = [];
  if (preset.delay) {
    netemOpts.push(`delay ${preset.delay}ms`);
    if (preset.jitter) netemOpts.push(`${preset.jitter}ms`);
  }
  if (preset.loss) netemOpts.push(`loss ${preset.loss}%`);
  if (preset.rate) netemOpts.push(`rate ${preset.rate}`);

  execSync(`tc qdisc add dev eth0 root handle 1: prio`);
  execSync(
    `tc qdisc add dev eth0 parent 1:3 handle 30: netem ${netemOpts.join(' ')}`
  );
  execSync(
    `tc filter add dev eth0 protocol ip parent 1:0 prio 3 ` +
    `u32 match ip dport ${port} 0xffff match ip protocol 17 0xff flowid 1:3`
  );
}
```

## Cambiar la red en plena llamada

Acá viene lo que ninguna prueba estática captura. En la vida real, la red cambia **durante** la llamada. El usuario sale de la sala de reuniones, se mete al ascensor, el Wi-Fi tambalea. Las reglas de `tc` se pueden modificar en caliente, así que puedes simular ese viaje:

```typescript
test('aumento y recuperación de pérdida durante la llamada', async ({ callerPage, receiverPage }) => {
  await establishCall(callerPage, receiverPage);
  await verifyVideoIsPlaying(callerPage);

  const port = await getWebRTCLocalPort(callerPage);
  expect(port).not.toBeNull();

  // Fase 1: inyectar 10% de pérdida (Wi-Fi inestable)
  applyTCPreset(port!, TCPresets.unstableWifi);
  await callerPage.waitForTimeout(8000);

  // ¿La llamada se mantiene?
  const state1 = await getConnectionState(callerPage);
  expect(state1).toBe('connected');

  // Fase 2: limpiar condiciones (recuperación)
  clearNetworkRules();
  await callerPage.waitForTimeout(5000);

  // El video debe recuperarse
  await verifyVideoIsPlaying(callerPage);
});
```

## Medir la degradación, no solo verla

"Se ve feo" no es una aserción que un test entienda. Hay que volverlo número. Cuando hay pérdida de paquetes, el decoder de WebRTC pelea por reconstruir los cuadros faltantes y la tasa de cuadros cae. La aserción interesante es doble: la tasa **baja**, pero no llega a cero. Sigue habiendo llamada, solo que peor.

```typescript
test('con 10% de pérdida la tasa de cuadros baja pero la llamada se mantiene', async ({
  callerPage, receiverPage
}) => {
  await establishCall(callerPage, receiverPage);

  // Medir línea base
  const baselineFps = await measureFrameRate(receiverPage, 5000);

  // Inyectar 10% de pérdida
  const port = await getWebRTCLocalPort(callerPage);
  applyTCPreset(port!, TCPresets.unstableWifi);
  await callerPage.waitForTimeout(5000); // esperar a que se estabilice

  // Medir después de la degradación
  const degradedFps = await measureFrameRate(receiverPage, 5000);

  // La tasa bajó, pero no se detuvo del todo
  expect(degradedFps).toBeGreaterThan(0);
  expect(degradedFps).toBeLessThan(baselineFps);

  clearNetworkRules();
});
```

Ese `toBeGreaterThan(0)` es la parte que importa. Una llamada borrosa que sigue viva es muy distinta de una llamada congelada. Para una clase en línea o una consulta médica remota, esa diferencia es entre "se entiende con esfuerzo" y "colgaron y nadie sabe qué pasó".

## Cortar el cable y volver a conectar

El caso más duro: la red se cae por completo y la app tiene que reconectar sola con un ICE restart. Con `tc` lo simulas poniendo 100% de pérdida unos segundos y después limpiando:

```typescript
test('reconexión después de un corte temporal de red', async ({ callerPage, receiverPage }) => {
  await instrumentWebRTC(callerPage);
  await establishCall(callerPage, receiverPage);

  const port = await getWebRTCLocalPort(callerPage);

  // Tirar todo el tráfico (corte)
  execSync(`tc qdisc add dev eth0 root handle 1: prio`);
  execSync(`tc qdisc add dev eth0 parent 1:3 handle 30: netem loss 100%`);
  execSync(
    `tc filter add dev eth0 protocol ip parent 1:0 prio 3 ` +
    `u32 match ip dport ${port} 0xffff match ip protocol 17 0xff flowid 1:3`
  );

  // 5 segundos de corte
  await callerPage.waitForTimeout(5000);

  // Restablecer la red
  clearNetworkRules();

  // Esperar a que la lógica de reconexión (ICE restart) actúe
  await callerPage.waitForFunction(() => {
    const pc = (window as any).__rtcPeerConnection as RTCPeerConnection;
    return pc?.connectionState === 'connected';
  }, { timeout: 20000 });

  // Verificar la transición de estados ICE
  const logs = await callerPage.evaluate(
    () => (window as any).__webrtcLogs
  );
  expect(logs.iceStates).toContain('disconnected');
  expect(logs.connectionStates[logs.connectionStates.length - 1]).toBe('connected');
});
```

## No te olvides de limpiar

Detalle aburrido pero traicionero: las reglas de `tc` sobreviven entre pruebas hasta que el contenedor muere. Si no limpias, la prueba siguiente arranca con la red ya rota y vas a perseguir un fantasma toda la tarde. Yo lo hice. No es divertido. Pon esto y olvídate:

```typescript
test.afterEach(async () => {
  clearNetworkRules();
});
```

## Cuándo usar cuál

| Objetivo de la prueba | Herramienta | Por qué |
|---|---|---|
| Retraso de señalización | CDP | WebSocket es TCP |
| Video que se entrecorta | tc/netem | RTP es UDP |
| Audio que se corta por pérdida | tc/netem | RTCP es UDP |
| Respuesta lenta de la API | CDP | HTTP es TCP |
| Corte total de red | tc (todos los puertos) | bloquea TCP y UDP |

Un detalle que me cambió el panorama: como `tc` opera en el kernel y no en el navegador, no depende de Chromium. La misma receta de comandos te sirve para probar en Firefox o WebKit. CDP, en cambio, es solo Chromium. Así que para escenarios multi-navegador, `tc` no es una opción más, es la única que te cubre los tres.

## Lo que aprendí por las malas

La suite en verde nunca me mintió a propósito. Yo le pedía la pregunta equivocada y ella me daba una respuesta honesta a esa pregunta equivocada. El día que dejé de probar "la red lenta" con CDP y empecé a inyectar pérdida real con `tc/netem`, mis pruebas empezaron a fallar. Y por primera vez, eso fue una buena noticia: fallaban donde el usuario sufría, antes que él.

No necesitas comprar equipos ni montar un laboratorio de redes. Necesitas Docker, `NET_ADMIN` y diez líneas de `netem`. El simulador de redes más útil que vas a usar ya viene instalado en tu kernel; solo faltaba que lo invitaras a tus pruebas.

---

*ken imoto · WebRTC & Voice AI engineer · [kenimoto.dev](https://kenimoto.dev/es/)*
