#!/usr/bin/env node
/**
 * Generate "1 agent vs 3 roles" comparison diagrams (1920x1080 PNG)
 * for EN, JA, PT, ES versions of the Observer/Strategist/Marketer blog.
 */
import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import puppeteer from 'puppeteer';

const OUTPUTS = [
  {
    lang: 'en',
    out: '/home/iris/repos/kenimoto-dev/public/images/blog/three-role-separation-observer-strategist-marketer/one-agent-vs-three-roles.png',
    title: '1 agent vs 3 roles',
    subtitle: 'Observer / Strategist / Marketer',
    leftLabel: '1 agent (everything)',
    rightLabel: '3 roles (separated)',
    leftStat: '~20 min &middot; 120k tokens',
    rightStat: '~3 min &middot; 45k tokens',
    leftNode: 'Observer + Strategist + Marketer',
    leftNodeSub: 'one monolithic agent',
    role1: 'Observer',
    role1Tool: 'no WebSearch',
    role2: 'Strategist',
    role2Tool: 'no WebSearch',
    role3: 'Marketer',
    role3Tool: 'WebSearch OK',
    bigStat: '&minus;85% time &middot; &minus;60% tokens',
    fanLabel: '8&times; WebSearch',
    handoffLabel: 'cron handoff',
  },
  {
    lang: 'ja',
    out: '/home/iris/repos/kenimoto-dev/public/images/blog/observer-strategist-marketer-3-yaku-bunri/one-agent-vs-three-roles-ja.png',
    title: '1エージェント vs 3役分離',
    subtitle: 'Observer / Strategist / Marketer',
    leftLabel: '1エージェント (統合)',
    rightLabel: '3役 (分離)',
    leftStat: '約20分 &middot; 120k tokens',
    rightStat: '約3分 &middot; 45k tokens',
    leftNode: 'Observer + Strategist + Marketer',
    leftNodeSub: 'モノリシックな1つのエージェント',
    role1: 'Observer',
    role1Tool: 'WebSearchなし',
    role2: 'Strategist',
    role2Tool: 'WebSearchなし',
    role3: 'Marketer',
    role3Tool: 'WebSearch可',
    bigStat: '時間 &minus;85% &middot; トークン &minus;60%',
    fanLabel: 'WebSearch &times;8',
    handoffLabel: 'cronで引き渡し',
  },
  {
    lang: 'pt',
    out: '/home/iris/repos/kenimoto-dev/public/images/blog/tres-papeis-observer-strategist-marketer-separacao/um-agente-vs-tres-papeis-pt.png',
    title: '1 agente vs 3 papéis',
    subtitle: 'Observer / Strategist / Marketer',
    leftLabel: '1 agente (tudo)',
    rightLabel: '3 papéis (separados)',
    leftStat: '~20 min &middot; 120k tokens',
    rightStat: '~3 min &middot; 45k tokens',
    leftNode: 'Observer + Strategist + Marketer',
    leftNodeSub: 'um agente monolítico',
    role1: 'Observer',
    role1Tool: 'sem WebSearch',
    role2: 'Strategist',
    role2Tool: 'sem WebSearch',
    role3: 'Marketer',
    role3Tool: 'com WebSearch',
    bigStat: 'tempo &minus;85% &middot; tokens &minus;60%',
    fanLabel: '8&times; WebSearch',
    handoffLabel: 'handoff via cron',
  },
  {
    lang: 'es',
    out: '/home/iris/repos/kenimoto-dev/public/images/blog/tres-roles-observer-strategist-marketer-separacion/un-agente-vs-tres-roles-es.png',
    title: '1 agente vs 3 roles',
    subtitle: 'Observer / Strategist / Marketer',
    leftLabel: '1 agente (todo)',
    rightLabel: '3 roles (separados)',
    leftStat: '~20 min &middot; 120k tokens',
    rightStat: '~3 min &middot; 45k tokens',
    leftNode: 'Observer + Strategist + Marketer',
    leftNodeSub: 'un agente monolítico',
    role1: 'Observer',
    role1Tool: 'sin WebSearch',
    role2: 'Strategist',
    role2Tool: 'sin WebSearch',
    role3: 'Marketer',
    role3Tool: 'con WebSearch',
    bigStat: 'tiempo &minus;85% &middot; tokens &minus;60%',
    fanLabel: '8&times; WebSearch',
    handoffLabel: 'handoff por cron',
  },
];

function buildHtml(d) {
  return `<!DOCTYPE html>
<html lang="${d.lang}">
<head>
<meta charset="UTF-8">
<style>
:root {
  --navy: #1E3A5F;
  --navy-mid: #3D6B99;
  --navy-light: #7BA3CC;
  --navy-bg: #E8EEF4;
  --navy-bg-light: #F0F4F8;
  --dark: #1A1A2E;
  --secondary: #6B7B8D;
  --white: #FFFFFF;
  --border: #D8E0EC;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body {
  width: 1920px;
  height: 1080px;
  overflow: hidden;
}
body {
  font-family: 'Noto Sans CJK JP', 'Noto Sans JP', sans-serif;
  background: var(--white);
  color: var(--dark);
  padding: 56px 80px;
  position: relative;
}
.header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 36px;
}
.title {
  font-size: 72px;
  font-weight: 900;
  color: var(--dark);
  line-height: 1.0;
  letter-spacing: -0.02em;
}
.subtitle {
  font-size: 32px;
  font-weight: 400;
  color: var(--secondary);
  letter-spacing: 0.02em;
}
.compare {
  display: grid;
  grid-template-columns: 1fr 120px 1fr;
  gap: 28px;
  align-items: stretch;
  margin-bottom: 36px;
}
.col {
  background: var(--navy-bg-light);
  border-radius: 16px;
  padding: 36px 40px 32px 40px;
  display: flex;
  flex-direction: column;
  min-height: 660px;
  position: relative;
}
.col.left  { border-top: 10px solid var(--navy-light); }
.col.right { border-top: 10px solid var(--navy); }
.col-label {
  font-size: 34px;
  font-weight: 900;
  color: var(--navy);
  margin-bottom: 6px;
  line-height: 1.1;
}
.col-stat {
  font-size: 32px;
  font-weight: 400;
  color: var(--secondary);
  margin-bottom: 28px;
}
/* ---- LEFT COLUMN: one big node + 8 fanning arrows ---- */
.canvas {
  flex: 1;
  position: relative;
}
.mono-node {
  position: absolute;
  left: 50%;
  top: 78%;
  transform: translate(-50%, -50%);
  background: var(--white);
  border: 3px solid var(--navy-mid);
  border-radius: 16px;
  padding: 22px 28px;
  width: 540px;
  text-align: center;
  box-shadow: 0 0 0 8px rgba(125, 163, 204, 0.18);
}
.mono-node .n-main {
  font-size: 34px;
  font-weight: 700;
  color: var(--navy);
  line-height: 1.15;
}
.mono-node .n-sub {
  font-size: 32px;
  font-weight: 400;
  color: var(--secondary);
  margin-top: 8px;
}
.fan-label {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 32px;
  font-weight: 700;
  color: var(--white);
  background: var(--navy-mid);
  border-radius: 999px;
  padding: 8px 24px;
  white-space: nowrap;
  z-index: 2;
}
.fan-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
/* ---- DIVIDER (vs) ---- */
.vs {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56px;
  font-weight: 900;
  color: var(--navy-light);
  letter-spacing: 0.02em;
}
/* ---- RIGHT COLUMN: 3 stacked role cards ---- */
.roles {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
  position: relative;
}
.role-card {
  background: var(--white);
  border: 2px solid var(--navy-bg);
  border-left: 8px solid var(--navy);
  border-radius: 16px;
  padding: 18px 26px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
}
.role-card .r-name {
  font-size: 40px;
  font-weight: 900;
  color: var(--dark);
  line-height: 1.0;
}
.role-card .r-tool {
  font-size: 32px;
  font-weight: 400;
  color: var(--secondary);
  margin-top: 10px;
}
.role-card.no-ws {
  border-left-color: var(--navy-mid);
}
.role-card.no-ws .r-tool {
  color: var(--navy);
  font-weight: 700;
}
.web-icon {
  width: 70px;
  height: 70px;
  flex-shrink: 0;
  position: relative;
}
.handoff-arrows {
  position: absolute;
  top: 0; bottom: 0;
  left: -30px;
  width: 30px;
  pointer-events: none;
}
.handoff-label {
  position: absolute;
  left: -16px;
  top: 50%;
  transform: translate(-100%, -50%) rotate(-90deg);
  transform-origin: right center;
  font-size: 32px;
  font-weight: 700;
  color: var(--navy-mid);
  white-space: nowrap;
}
/* ---- FOOTER ---- */
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 22px;
  border-top: 2px solid var(--navy-bg);
}
.big-stat {
  font-size: 52px;
  font-weight: 900;
  color: var(--navy);
  letter-spacing: -0.01em;
}
.brand {
  font-size: 28px;
  font-weight: 400;
  color: var(--secondary);
}
</style>
</head>
<body>
  <div class="header">
    <div class="title">${d.title}</div>
    <div class="subtitle">${d.subtitle}</div>
  </div>

  <div class="compare">
    <!-- LEFT: 1 agent everything -->
    <div class="col left">
      <div class="col-label">${d.leftLabel}</div>
      <div class="col-stat">${d.leftStat}</div>
      <div class="canvas">
        <div class="fan-label">${d.fanLabel}</div>
        <svg class="fan-svg" viewBox="0 0 600 540" preserveAspectRatio="none">
          <defs>
            <marker id="arr-mid" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#3D6B99"/>
            </marker>
          </defs>
          <!-- center near node top -->
          <!-- 8 arrows radiating upward in a fan, ending below the pill label -->
          <g stroke="#3D6B99" stroke-width="3" fill="none" marker-end="url(#arr-mid)">
            <line x1="300" y1="350" x2="50"  y2="180"/>
            <line x1="300" y1="350" x2="120" y2="135"/>
            <line x1="300" y1="350" x2="210" y2="110"/>
            <line x1="300" y1="350" x2="300" y2="105"/>
            <line x1="300" y1="350" x2="390" y2="110"/>
            <line x1="300" y1="350" x2="480" y2="135"/>
            <line x1="300" y1="350" x2="550" y2="180"/>
            <line x1="300" y1="350" x2="575" y2="240"/>
          </g>
        </svg>
        <div class="mono-node">
          <div class="n-main">${d.leftNode}</div>
          <div class="n-sub">${d.leftNodeSub}</div>
        </div>
      </div>
    </div>

    <!-- DIVIDER -->
    <div class="vs">vs</div>

    <!-- RIGHT: 3 roles separated -->
    <div class="col right">
      <div class="col-label">${d.rightLabel}</div>
      <div class="col-stat">${d.rightStat}</div>
      <div class="roles">
        <svg class="handoff-arrows" viewBox="0 0 30 540" preserveAspectRatio="none">
          <defs>
            <marker id="arr-down" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#3D6B99"/>
            </marker>
          </defs>
          <g stroke="#3D6B99" stroke-width="3" fill="none" marker-end="url(#arr-down)">
            <line x1="15" y1="155" x2="15" y2="200"/>
            <line x1="15" y1="335" x2="15" y2="380"/>
          </g>
        </svg>

        <!-- Observer (no WebSearch) -->
        <div class="role-card no-ws">
          <div>
            <div class="r-name">${d.role1}</div>
            <div class="r-tool">${d.role1Tool}</div>
          </div>
          <svg class="web-icon" viewBox="0 0 70 70">
            <circle cx="35" cy="35" r="26" fill="none" stroke="#7BA3CC" stroke-width="3"/>
            <ellipse cx="35" cy="35" rx="12" ry="26" fill="none" stroke="#7BA3CC" stroke-width="3"/>
            <line x1="9" y1="35" x2="61" y2="35" stroke="#7BA3CC" stroke-width="3"/>
            <line x1="8" y1="8" x2="62" y2="62" stroke="#1E3A5F" stroke-width="5"/>
          </svg>
        </div>

        <!-- Strategist (no WebSearch) -->
        <div class="role-card no-ws">
          <div>
            <div class="r-name">${d.role2}</div>
            <div class="r-tool">${d.role2Tool}</div>
          </div>
          <svg class="web-icon" viewBox="0 0 70 70">
            <circle cx="35" cy="35" r="26" fill="none" stroke="#7BA3CC" stroke-width="3"/>
            <ellipse cx="35" cy="35" rx="12" ry="26" fill="none" stroke="#7BA3CC" stroke-width="3"/>
            <line x1="9" y1="35" x2="61" y2="35" stroke="#7BA3CC" stroke-width="3"/>
            <!-- strike through -->
            <line x1="8" y1="8" x2="62" y2="62" stroke="#1E3A5F" stroke-width="5"/>
          </svg>
        </div>

        <!-- Marketer (WebSearch OK) -->
        <div class="role-card">
          <div>
            <div class="r-name">${d.role3}</div>
            <div class="r-tool">${d.role3Tool}</div>
          </div>
          <svg class="web-icon" viewBox="0 0 70 70">
            <circle cx="35" cy="35" r="26" fill="none" stroke="#1E3A5F" stroke-width="3"/>
            <ellipse cx="35" cy="35" rx="12" ry="26" fill="none" stroke="#1E3A5F" stroke-width="3"/>
            <line x1="9" y1="35" x2="61" y2="35" stroke="#1E3A5F" stroke-width="3"/>
          </svg>
        </div>
      </div>
    </div>
  </div>

  <div class="footer">
    <div class="big-stat">${d.bigStat}</div>
    <div class="brand">kenimoto.dev &middot; ${d.handoffLabel}</div>
  </div>
</body>
</html>`;
}

async function render(browser, item) {
  const html = buildHtml(item);
  const htmlPath = item.out.replace(/\.png$/, '.html');
  mkdirSync(dirname(item.out), { recursive: true });
  writeFileSync(htmlPath, html, 'utf-8');

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' });
  // small extra wait to ensure web fonts settle
  await new Promise(r => setTimeout(r, 200));
  await page.screenshot({ path: item.out, type: 'png', clip: { x: 0, y: 0, width: 1920, height: 1080 } });
  await page.close();
  console.log('OK  ' + item.lang + '  ' + item.out);
}

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
for (const item of OUTPUTS) {
  await render(browser, item);
}
await browser.close();
console.log('Done');
