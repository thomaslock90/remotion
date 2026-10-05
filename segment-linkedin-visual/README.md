# Segment split — LinkedIn visual

A self-contained [Remotion](https://remotion.dev) project (sowly.ai brand) that renders
"one vertical, two worlds" for LinkedIn: a Fashion & Lifestyle customer analysis
(55% mid-market, 18% enterprise) split into two side-by-side worlds (decision makers,
buyer journey, interests), ending with why one message for both fails.

- **Format:** 1080×1350 (4:5), 30 fps, ~15.7 s (470 frames), H.264 + AAC
- The video opens on the finished visual for 20 frames (`POSTER` in `src/Root.tsx`), so
  the first frame, which players and LinkedIn show before playback, is the preview.
  It then fades into the 15 s animation. Frame 0 is also the static PNG.

## Render

```bash
npm install
npm run still           # writes out/segment-split.png (static post image / thumbnail)
npm run render          # writes out/segment-split.mp4 (animated version)
```

In this container, add
`--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`
to skip the Chrome download.

To also embed the PNG as the MP4's cover thumbnail (shown by file browsers):

```bash
ffmpeg -i out/segment-split.png -q:v 2 out/thumb.jpg
ffmpeg -i out/segment-split.mp4 -i out/thumb.jpg -map 0 -map 1 -c copy \
  -disposition:v:1 attached_pic out/segment-split-thumb.mp4
```

## Edit

Copy lives at the top of `src/SegmentSplit.tsx`: `MID_PCT`, `ENT_PCT` and `ROWS`.
The logo is `public/sowly-logo.png`.
