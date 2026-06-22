---
title: "I Wired Claude Code to Real Hardware Over USB Serial. The MCP Tool Was the Easy Part."
description: "Writing an MCP server that lets Claude Code drive a USB-connected microcontroller takes an afternoon. The hard part is permission design for irreversible writes and matching an LLM's second-scale latency to hardware's microsecond control loop."
date: 2026-06-17
lang: en
tags: [claude-code, mcp, embedded, hardware, anthropic]
featured: false
canonical_url: "https://kenimoto.dev/blog/claude-code-real-hardware-usb"
og_image: "https://kenimoto.dev/images/blog/claude-code-real-hardware-usb/og.png"
cross_posted_to:
  - platform: Dev.to
    url: https://dev.to/kenimo49/claude-code-over-usb-serial-driving-real-hardware-through-one-mcp-tool-i1n
---

The first time I let Claude Code run a temperature control loop on real hardware, I built an oscillator. Not on purpose. I had a BME280 sensor and a PWM fan on an ESP32-S3, and I asked Claude to read the temperature and decide the fan speed. Room hits 28C, Claude thinks for three seconds, spins the fan to max, the room cools to 27, Claude thinks for another three seconds, cuts the fan, the room warms back up, and around we go. The fan spent the afternoon revving and dying like a teenager learning to drive a manual. My desk sounded like a small airport.

That failure taught me the thing this whole post is about. I'm an AI engineer who does WebRTC and voice work, and I drifted into embedded the way most people drift into anything expensive: a side project got out of hand. So when I say the MCP tool was the easy part, I mean it literally. The tool definition was an afternoon. The two things that actually mattered took weeks to get right, and neither of them is code you can copy off GitHub.

## The MCP tool really is the easy part

Here's the honest version of "expose a USB serial device to Claude." You write five tools. That's the whole minimal server.

```python
# serial_mcp.py
import serial
import serial.tools.list_ports
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("usb-serial")

# One connection held in-process. A serial port can't be opened
# by two processes at once, so the server owns it exclusively.
_connection: serial.Serial | None = None


@mcp.tool()
def list_devices() -> list[dict]:
    """Return every USB serial device the OS currently sees."""
    return [
        {"port": p.device, "description": p.description, "hwid": p.hwid}
        for p in serial.tools.list_ports.comports()
    ]


@mcp.tool()
def connect(port: str, baudrate: int = 115200) -> str:
    """Open one port. Replaces any existing connection."""
    global _connection
    if _connection is not None and _connection.is_open:
        _connection.close()
    _connection = serial.Serial(port, baudrate, timeout=1)
    return f"connected to {port} at {baudrate} baud"


@mcp.tool()
def send(payload: str) -> str:
    """Write an ASCII string to the connected device."""
    if _connection is None or not _connection.is_open:
        return "error: not connected. call connect() first."
    _connection.write(payload.encode("ascii"))
    _connection.flush()
    return f"sent {len(payload)} bytes: {payload!r}"


@mcp.tool()
def recv(max_bytes: int = 256) -> str:
    """Read up to max_bytes from the receive buffer."""
    if _connection is None or not _connection.is_open:
        return "error: not connected."
    data = _connection.read(max_bytes)
    return data.decode("ascii", errors="replace")


@mcp.tool()
def disconnect() -> str:
    """Close the connection."""
    global _connection
    if _connection is None:
        return "no active connection"
    _connection.close()
    _connection = None
    return "disconnected"


if __name__ == "__main__":
    mcp.run()
```

`FastMCP` generates the JSON schema for each tool from the function signature and docstring, so the part that feels like it should be hard, teaching Claude what these tools do, is handled by a decorator. Register it in `.mcp.json` and restart:

```json
{
  "mcpServers": {
    "usb-serial": {
      "command": "python",
      "args": ["/abs/path/to/serial_mcp.py"]
    }
  }
}
```

Now I can say "blink the LED on the ESP32 three times" and Claude calls `list_devices`, notices the board on `/dev/ttyACM0`, connects at 115200, and sequences the sends itself. I didn't write the orchestration. I wrote five functions and a paragraph of docstrings, and the model figured out the order.

One detail in `recv` earns its keep: `errors="replace"`. If a stray binary byte comes back and you let ASCII decoding throw, Claude reads the tool call as failed and the conversation stalls. Replacing junk with the placeholder character keeps the dialogue moving. That's the kind of thing you only learn by watching it break.

If you don't want to write your own, there's prior art worth reading. [serial-mcp-server](https://github.com/Adancurusul/serial-mcp-server) is a Rust implementation that talks to STM32, Arduino, ESP32, or anything with a UART, and ships as a single binary, which is handy when you don't want a Python runtime on the target machine. [arduino-mcp-server](https://github.com/hardware-mcp/arduino-mcp-server) wraps `arduino-cli` so the model can compile, flash, and monitor serial end to end. I usually start from my own Python because the prototype phase moves faster when I can rip tools out and add them, but the Rust one wins on distribution.

So that's the easy part, done. An afternoon. Now the trouble starts.

## The hard part is deciding what Claude is allowed to break

A software bug is Ctrl+Z. A wrong I2C write is a brick.

The moment your MCP tools can write to a physical bus, they inherit a category of failure that pure-software tools never have. Get a write address off by one digit and you've clobbered the register on the device next door. Set the wrong GPIO to output mode into the supply rail and the board cooks. Claude doesn't have to be malicious for this. It just has to be confidently wrong about a hex address, which, if you've spent any time with these models, you know happens with a perfectly steady voice.

So you design permissions, and you design them assuming the writes can't be taken back. In my embedded bridge server, the minimum I ship is three things. First, a write whitelist: addresses not on the list get rejected by the tool itself, before a single byte hits the bus.

```python
I2C_WRITE_WHITELIST = {0x76, 0x77, 0x3C}  # BME280 and the OLED

@mcp.tool()
def i2c_write(address: int, data: list[int], dry_run: bool = True) -> dict:
    """Write bytes to an I2C address. dry_run returns the payload
    without touching the bus."""
    if address not in I2C_WRITE_WHITELIST:
        return {
            "ok": False,
            "error_kind": "address_not_whitelisted",
            "message": f"0x{address:02x} is not in the write whitelist.",
        }
    payload = f"I2C_WRITE,{address:02x}," + ",".join(f"{b:02x}" for b in data)
    if dry_run:
        return {"ok": True, "dry_run": True, "would_send": payload}
    ser.write((payload + "\n").encode())
    return {"ok": True, "sent": payload}
```

Second, `dry_run=True` as the default, not the exception. The tool defaults to showing Claude the bytes it would send instead of sending them. The model reviews its own payload, I review it, and only then does someone flip `dry_run=False`. Dry-run, confirm, execute, in that order, becomes the loop for anything that writes. Third, a flat refusal on dangerous GPIO operations: requests to drive power pins or the USB data lines to output mode get rejected, full stop, no override flag.

This pairs with Claude Code's own permission model, which is the second wall. Claude Code has three modes, Ask, Allow, and Deny, and the official guidance for 2026 is to scope your deny rules first for anything irreversible, before you allow anything ([Claude Code Permissions, 2026](https://www.claudedirectory.org/blog/claude-code-permissions-guide)). The canonical cautionary tale in the docs is a write-capable MCP tool wired to a database account that can `DROP TABLE` with no deny rule in the way. Swap "DROP TABLE" for "write to the motor controller's calibration register" and you have my Tuesday. There's a flag called `--dangerously-skip-permissions` that turns the whole confirmation loop off, and the name is doing exactly the job it should: it is telling you not to. (Anthropic also patched a 2025 bug where deny rules could be bypassed through symlinks, which is a useful reminder that even the wall has a wall.)

None of this is "I don't trust the model." I trust it about as much as I trust myself at 2am, which is to say: enough to let it propose, not enough to let it commit without a diff. Physical writes are expensive to get wrong, so they get two-key confirmation. That's not paranoia, that's just how you treat a register you can't un-write.

![A flow diagram showing the dry-run, confirm, execute permission loop for irreversible hardware writes](/images/blog/claude-code-real-hardware-usb/claude-code-real-hardware-usb-2.png)

## Impedance matching: the LLM is the operator, the MCU is the machine

Now back to my oscillating fan, because it's the same problem wearing a different coat.

In electronics, you match the impedance of a source and a load so the signal transfers cleanly instead of reflecting back and distorting. Put a 50-ohm cable into a 75-ohm load and some of the energy bounces. The LLM and the hardware have the same mismatch, except the property that's mismatched is response time. Claude Code answers in seconds to tens of seconds. A motor current loop runs at 10 to 20 kHz, meaning it needs a fresh decision every 50 to 100 microseconds. That's a six-order-of-magnitude gap, and the fatal mistake is assuming both sides can meet somewhere in the middle. They cannot. There is no middle. My fan proved it at volume.

You match the impedance by splitting the roles, not by speeding anyone up.

- The LLM is the operator. It picks setpoints, diagnoses, tunes parameters, reads logs, spots anomalies. Its clock is seconds to minutes.
- The MCU is the machine. It samples sensors, runs the control loop, drives actuators. Its clock is milliseconds to microseconds.
- A buffer sits between them. The MCU streams JSON logs over serial; Claude reads them and occasionally writes back a new setpoint. Neither one waits on the other.

Once I moved the actual PID loop down into the ESP32 firmware and left Claude with exactly one job, write `SP 24.5\n` when it decides the target should change, the oscillation vanished. The MCU holds 25C on a tight 1 Hz loop. Claude looks at an hour of logs and says "your integral gain is too high, the overshoot keeps stacking, try dropping ki from 0.5 to 0.2." I try it, I measure, we iterate. The human and the model are in the *tuning* loop. Neither of us is anywhere near the *control* loop, and that's the entire point.

![A diagram contrasting the LLM as operator at seconds-to-minutes timescale versus the MCU as machine at milliseconds-to-microseconds timescale](/images/blog/claude-code-real-hardware-usb/claude-code-real-hardware-usb-1.png)

## The safety mechanisms don't get a vote

There's one line I won't cross, and it's the cleanest rule in all of this: the safety layer never goes through the AI. Not the MCU's firmware logic, not the MCP server, not Claude. The AI is not in the loop, and it is not a fallback for the loop either.

What that means concretely:

- A physical stop button that mechanically cuts motor power, touching no software at all.
- A hardware watchdog timer inside the MCU that resets the chip if it stops responding, with no PC and no model involved.
- Fail-safe defaults the MCU decides on its own: sensor dies or the link drops, PWM goes to zero, valve closes. The MCU does this whether or not anything upstream is listening.
- Hardware limiters on temperature and current that cut power at the circuit level when a threshold trips.

The reasoning is the same response-time math from the last section, just with the stakes turned up. If I ask Claude "stop everything if it gets dangerous," the danger arrives and resolves itself, possibly in flames, in the multiple seconds Claude spends composing a thoughtful reply. Safety lives in physics and in the MCU, where the response time is fast enough to matter. You don't hand the airbag to the committee.

## What I'd tell you before you plug anything in

Wiring Claude Code to real hardware is genuinely fun, and the MCP server is the part everyone warns you about and the part that takes the least time. The two things that actually decide whether your afternoon ends with a working rig or a faint smell of solder are these. Design your permissions like the writes are permanent, because on a physical bus they are: whitelist, dry-run by default, deny-first. And match the impedance by role, never by speed: the LLM sets the target and reads the logs, the MCU runs the loop and owns the safety, and a buffer keeps them from ever waiting on each other.

Get those two right and the model becomes a genuinely good lab partner: tireless at log analysis, sharp at PID tuning, happy to read a datasheet you'd rather not. Get them wrong and you build an oscillator. Ask me how I know.

If you want a deeper playbook on driving Claude Code as an engineering tool, permissions, MCP design, and the workflows that hold up under real pressure, I wrote it down in [Practical Claude Code](https://kenimoto.dev/books/claude-code-mastery?utm_source=kenimoto-dev-blog&utm_medium=article&utm_campaign=claude-code-real-hardware-usb).
