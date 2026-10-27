# Revenue knobs — LinkedIn visual

A self-contained [Remotion](https://remotion.dev) project (sowly.ai brand): a revenue
model with one knob per team (marketing, sales, customer success). Turning the knobs drops
the demos needed for the same revenue target from 3,0× to 1,7×, followed by the test rule
(stop / adjust / scale) and the closing question.

- **Format:** 1080×1080 (1:1), 30 fps, ~15.7 s (470 frames). The video opens on the
  finished visual for 20 frames (`POSTER` in `src/Root.tsx`) so the preview shows it.
- **GIF:** `RevenueKnobsLoop`, a 4 s seamless loop (15 fps) that starts and ends at 1,7×
  and dips to 3,0× in between. Rendered at 1200×1200.
- Only the 3,0× and 1,7× end values come from the post; values in between are animation.

## Render

```bash
npm install
npm run still           # out/revenue-knobs.png
npm run render          # out/revenue-knobs.mp4 (raw)
```

In this container, add
`--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`.

## LinkedIn export

```bash
# MP4: single H.264 yuv420p stream, AAC, faststart
ffmpeg -i out/revenue-knobs.mp4 -map 0:v:0 -map 0:a:0 \
  -c:v libx264 -profile:v high -level:v 4.0 -pix_fmt yuv420p -color_range tv -crf 18 -r 30 -g 60 \
  -c:a aac -b:a 128k -ar 48000 -ac 2 -movflags +faststart out/revenue-knobs-linkedin.mp4

# GIF: 1200x1200 loop
npx remotion render src/index.ts RevenueKnobsLoop out/loop --sequence --image-format=png --scale=1.1111111
ffmpeg -framerate 15 -i out/loop/element-%02d.png -vf "palettegen=max_colors=128:stats_mode=full" out/palette.png
ffmpeg -framerate 15 -i out/loop/element-%02d.png -i out/palette.png \
  -lavfi "paletteuse=dither=sierra2_4a:diff_mode=rectangle" -loop 0 out/revenue-knobs.gif
```

## Edit

Copy lives at the top of `src/RevenueKnobs.tsx`: `KNOBS`, `RULES`, `BEFORE` and `AFTER`.
