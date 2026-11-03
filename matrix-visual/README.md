# Strategy × engineering matrix — LinkedIn GIF

A self-contained [Remotion](https://remotion.dev) project (sowly.ai brand, with headshot):
the GTM strategy × GTM engineering 2×2 matrix as a 7 s seamless GIF loop. A cursor
"hovers" each quadrant (card lifts, recolours and reveals its line): it starts on
Pipeline, visits "nothing happens" and "the most expensive mistake", then walks the
advice path, up first (strategy) and then right (engineering), back to Pipeline.

- **Format:** 1080×1080 composition at 15 fps (105 frames), rendered at 1200×1200
  for the GIF (~1.8 MB, LinkedIn's limit is 5 MB). Frame 0 is the static PNG.

## Render

```bash
npm install
npm run still           # out/matrix.png (1080x1080)
npm run frames          # out/frames/element-000.png … (1200x1200)
ffmpeg -framerate 15 -i out/frames/element-%03d.png -vf "palettegen=max_colors=128:stats_mode=full" out/palette.png
ffmpeg -framerate 15 -i out/frames/element-%03d.png -i out/palette.png \
  -lavfi "paletteuse=dither=sierra2_4a:diff_mode=rectangle" -loop 0 out/matrix.gif
```

In this container, add
`--browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`.

## Edit

Copy lives in `QUADRANTS`, the hover tour in `WAYPOINTS` (`src/Matrix.tsx`).
