# GTM levels photo carousel — LinkedIn (PDF)

A self-contained [Remotion](https://remotion.dev) project (sowly.ai brand) that renders a
7-slide photo carousel: from manual lists to a mature AI GTM stack, in three levels.

1. Cover · 2. Level 1 (Knaek) · 3–4. Level 2 (Jopp) · 5–6. Level 3 (Sowly) · 7. Closing question

- **Format:** 1080×1350 (4:5) per slide; one Remotion frame per slide.
- Photos live in `public/`. `l3-clay.jpg` has the workspace/credits popup and the
  prospect names blurred.

## Render

```bash
npm install
npm run slides          # writes out/slides/element-0.png … element-6.png
```

In this container, add
`--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`
to skip the Chrome download. Combine into a 1080×1350 PDF with img2pdf
(`get_fixed_dpi_layout_fun((72, 72))`), as in `../carousel-linkedin-content/README.md`.

## Edit

Copy and photo order live in `PHOTOS` at the top of `src/Carousel.tsx`.
