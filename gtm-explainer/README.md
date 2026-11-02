# GTM Engineering explainer — "uitgelegd in 1 minuut"

A self-contained [Remotion](https://remotion.dev) project (sowly.ai brand): a ~57 s, 1:1
explainer for a lay audience on what GTM engineering is, based on Clay's public best
practices, by Thomas Lock (Sowly.ai). Text only, no voice-over.

Scenes (`SCENES` in `src/scenes.tsx`, each with its own length):
0 Title · 1 What is GTM · 2 The problem · 3 GTM engineering · 4 Unique data ·
5 Signals that add up · 6 Upsell · 7 Keep testing · 8 How Sowly does it · 9 Outro

- **Format:** 1080×1080, 30 fps. Scenes are joined with 10-frame slide/wipe transitions
  (`src/Explainer.tsx`). The video opens on the finished title card for 15 frames
  (`POSTER`) so the first frame, shown before playback, is the preview.
- **Moodboard:** the `Moodboard` composition shows every scene's end state with its
  motion note.

## Render

```bash
npm install
npx remotion render src/index.ts Explainer out/gtm-explainer.mp4
npx remotion still src/index.ts Explainer out/gtm-explainer-thumbnail.png --frame=0
npx remotion still src/index.ts Moodboard out/moodboard.png --frame=0
```

In this container, add
`--browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`.

## LinkedIn export

```bash
ffmpeg -i out/gtm-explainer.mp4 -map 0:v:0 -map 0:a:0 \
  -c:v libx264 -profile:v high -level:v 4.0 -pix_fmt yuv420p -color_range tv -crf 18 -r 30 -g 60 \
  -c:a aac -b:a 128k -ar 48000 -ac 2 -movflags +faststart out/gtm-explainer-linkedin.mp4
```
