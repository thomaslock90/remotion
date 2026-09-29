# DNC flow — LinkedIn visual

A self-contained [Remotion](https://remotion.dev) project that renders the
"outbound with zero risk to existing relationships" flow for LinkedIn:

**New lead list → DNC list filter → excluded (match) / human-in-the-loop via Slack (no match)**

- **Format:** 1080×1350 (4:5), 30 fps, 12 s (360 frames)
- The last frame (359) is the complete static visual.

## Render

```bash
npm install
npm run still           # writes out/dnc-flow.png (static post image)
npm run render          # writes out/dnc-flow.mp4 (animated version)
```

In this container, add
`--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`
to skip the Chrome download.

## Edit

The logo is `public/sowly-logo.png` (official sowly.ai logo, background removed).

Copy lives at the top of `src/DncFlow.tsx`: `TOTAL` / `EXCLUDED` (example
numbers), `DNC_ITEMS` and `HITL_STEPS`.
