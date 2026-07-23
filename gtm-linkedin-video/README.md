# GTM Flow — LinkedIn video

A self-contained [Remotion](https://remotion.dev) project that renders an animated
six-step go-to-market pipeline, sized for LinkedIn's feed:

**Prospect list → Signal sourcing → Qualification → Contact lookup → Context for rep → CRM task**

- **Format:** 1080×1350 (4:5), 30 fps, 15 s (450 frames)
- The pipeline builds step-by-step; a data packet travels the spine, warming the
  palette from cold indigo to a "ready to act" green as it reaches the CRM task.

## Render

```bash
npm install
npm run render          # writes out/gtm-flow.mp4
```

In this container Chromium is pre-installed, so point Remotion at the headless-shell
binary to skip the download:

```bash
npx remotion render src/index.ts GtmFlow out/gtm-flow.mp4 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```

## Preview / edit

```bash
npm run studio          # opens Remotion Studio
```

## Layout

| File | Role |
| --- | --- |
| `src/index.ts` | Registers the Remotion root |
| `src/Root.tsx` | Composition config (size, fps, duration) |
| `src/GtmFlow.tsx` | The animation — palette, content, timeline |

Edit the `STEPS` array in `src/GtmFlow.tsx` to change copy or examples.
