# GTM offer — LinkedIn visual

A self-contained [Remotion](https://remotion.dev) project (sowly.ai brand) that renders
the three sequential GTM steps for LinkedIn:

**Positioning (attracts) → Offer (converts) → Delivery & service (retains)**

Leads first leak away at a weak offer; then three offer boosters (acute pain, simple
pricing & scope, hard results) click in and leads flow through to customers.

- **Format:** 1080×1350 (4:5), 30 fps, ~15.7 s (470 frames), H.264 + AAC
- The video opens on the finished visual for 20 frames (`POSTER` in `src/Root.tsx`), so
  the first frame, which players and LinkedIn show before playback, is the preview.
  It then fades into the 15 s animation. Frame 0 is also the static PNG.

## Render

```bash
npm install
npm run still           # writes out/gtm-offer.png (static post image / thumbnail)
npm run render          # writes out/gtm-offer.mp4 (animated version)
```

In this container, add
`--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`
to skip the Chrome download.

To embed the PNG as the MP4's cover thumbnail:

```bash
ffmpeg -i out/gtm-offer.png -q:v 2 out/thumb.jpg
ffmpeg -i out/gtm-offer.mp4 -i out/thumb.jpg -map 0 -map 1 -c copy \
  -disposition:v:1 attached_pic out/gtm-offer-thumb.mp4
```

## Edit

Copy lives at the top of `src/GtmOffer.tsx`: `STAGES` and `BOOSTERS`.
The logo is `public/sowly-logo.png`.
