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

## LinkedIn export

LinkedIn rejects the raw render (moov index at the end, full-range `yuvj420p`), and an
embedded cover image adds a second video stream it cannot handle. Re-encode before
uploading, and upload the PNG separately as the custom thumbnail:

```bash
ffmpeg -i out/dnc-flow.mp4 -map 0:v:0 -map 0:a:0 \
  -c:v libx264 -profile:v high -level:v 4.0 -pix_fmt yuv420p -color_range tv -crf 18 -r 30 -g 60 \
  -c:a aac -b:a 128k -ar 48000 -ac 2 -movflags +faststart out/dnc-flow-linkedin.mp4
```

## Edit

The logo is `public/sowly-logo.png` (official sowly.ai logo, background removed).

Copy lives at the top of `src/DncFlow.tsx`: `TOTAL` / `EXCLUDED` (example
numbers), `DNC_ITEMS` and `HITL_STEPS`.
