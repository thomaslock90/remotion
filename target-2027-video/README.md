# Target 2027 — LinkedIn video

A self-contained [Remotion](https://remotion.dev) project (sowly.ai brand, with headshot)
accompanying the "4 steps to hit your 2027 target" post. It complements the post rather
than repeating it: a hook question, a live back-calculation of a revenue target into
first meetings per week, the four steps as a staircase, and a hand-off to the post.

- **Format:** 1080×1080, 30 fps, 23 s. Frame 0 is the hook ("€750k = ? meetings per
  week") and doubles as the thumbnail.
- The funnel numbers (`TARGET`, `DEAL`, `WIN`, … in `src/Target2027.tsx`) are an
  illustrative example, deliberately different from the post's.

## Render

```bash
npm install
npm run still           # out/target-2027-thumbnail.png
npm run render          # out/target-2027.mp4 (raw)
```

In this container, add
`--browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`.

## LinkedIn export

```bash
ffmpeg -i out/target-2027.mp4 -map 0:v:0 -map 0:a:0 \
  -c:v libx264 -profile:v high -level:v 4.0 -pix_fmt yuv420p -color_range tv -crf 18 -r 30 -g 60 \
  -c:a aac -b:a 128k -ar 48000 -ac 2 -movflags +faststart out/target-2027-linkedin.mp4
```
