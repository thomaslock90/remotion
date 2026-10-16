# ICP noise — LinkedIn visual

A self-contained [Remotion](https://remotion.dev) project (sowly.ai brand): four slightly
different versions of "our ideal customer" (sales, customer success, management, CRM
closed-won) jitter as noise, then converge into one one-page ICP, followed by three
Scaling Up (Verne Harnish) moves and the closing question.

- **Format:** 1080×1350 (4:5), 30 fps, ~15.7 s (470 frames)
- The video opens on the finished visual for 20 frames (`POSTER` in `src/Root.tsx`), so
  the first frame, shown before playback, is the preview. Frame 0 is also the static PNG.
- The ICP values on the four cards are illustrative examples.

## Render

```bash
npm install
npm run still           # writes out/icp-noise.png
npm run render          # writes out/icp-noise.mp4 (raw)
```

In this container, add
`--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`
to skip the Chrome download.

## LinkedIn export

Re-encode before uploading (single H.264 yuv420p stream, AAC, faststart):

```bash
ffmpeg -i out/icp-noise.mp4 -map 0:v:0 -map 0:a:0 \
  -c:v libx264 -profile:v high -level:v 4.0 -pix_fmt yuv420p -color_range tv -crf 18 -r 30 -g 60 \
  -c:a aac -b:a 128k -ar 48000 -ac 2 -movflags +faststart out/icp-noise-linkedin.mp4
```

## LinkedIn GIF (organic post)

A separate 4 s seamless loop (`IcpLoop`, 15 fps) that starts and ends on the finished
visual: the four versions get noisy and settle again while data flows into the one-pager.
Rendered at 1200×1500 (4:5) and kept well under LinkedIn's 5 MB GIF limit (~2.1 MB):

```bash
npx remotion render src/index.ts IcpLoop out/loop --sequence --image-format=png --scale=1.1111111
ffmpeg -framerate 15 -i out/loop/element-%02d.png -vf "palettegen=max_colors=128:stats_mode=full" out/palette.png
ffmpeg -framerate 15 -i out/loop/element-%02d.png -i out/palette.png \
  -lavfi "paletteuse=dither=sierra2_4a:diff_mode=rectangle" -loop 0 out/icp-noise.gif
```

## Edit

Copy lives at the top of `src/IcpNoise.tsx`: `VOICES`, `ONE_PAGER` and `MOVES`.
