# Content carousel — LinkedIn (PDF)

A self-contained [Remotion](https://remotion.dev) project (sowly.ai brand) that renders an
10-slide LinkedIn carousel about content as the front end of the sales machine, with
client campaign data as proof, closing
with a Thomas Lock page.

- **Format:** 1080×1350 (4:5) per slide; one Remotion frame per slide.
- LinkedIn carousels are uploaded as a PDF document (one page per slide).

## Render

```bash
npm install
npm run slides          # writes out/slides/element-0.png … element-9.png
```

In this container, add
`--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`
to skip the Chrome download.

Then combine into a PDF (Python, `pip install img2pdf pillow`):

```python
import glob, img2pdf
from PIL import Image
fs = sorted(glob.glob('out/slides/element-*.png'), key=lambda f: int(f.split('-')[-1][:-4]))
pngs = []
for k, f in enumerate(fs, 1):
    o = f'out/slide-{k:02d}.png'
    Image.open(f).convert('RGB').save(o)
    pngs.append(o)
open('out/sowly-content-carousel.pdf', 'wb').write(
    img2pdf.convert(pngs, layout_fun=img2pdf.get_fixed_dpi_layout_fun((144, 144))))
```

## Edit

Each slide is a function in `src/Carousel.tsx` (`SLIDES` sets the order).
`public/sowly-logo.png` is the logo, `public/thomas.jpg` the portrait on the last slide,
`public/proof-weekly.png` / `public/proof-none.png` the campaign dashboard screenshots.
