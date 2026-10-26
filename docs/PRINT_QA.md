# Print QA

Checked on 2026-10-26 from `npm run export:all`. The manifest stamp is `2026-10-26T21:43:38.334Z`. The PDFs stay in `dist-print/`, which is gitignored. No sheet was sent to a printer.

## Pages

| File                       |   Bytes | Inches        | Pages |
| -------------------------- | ------: | ------------- | ----: |
| `chronos-letter.pdf`       | 1006458 | 8.5 × 11      |     1 |
| `chronos-tabloid.pdf`      | 1130105 | 11 × 17       |     1 |
| `chronos-poster.pdf`       | 1576949 | 24 × 36       |     1 |
| `chronos-poster-bleed.pdf` | 1588516 | 24.25 × 36.25 |     1 |
| `chronos-reference.pdf`    |  103297 | 8.5 × 11      |    14 |

`pdfinfo` matches those sizes. Letter is 612 × 792 pt. Tabloid is 792 × 1224 pt. The trim poster is 1728 × 2592 pt. The bleed poster is 1746 × 2610 pt.

## Selectable text

`pdftotext` on the trim poster reads `CHRONOS ATLAS`, `Sumerian city-states`, and `Kingdom of France → French Republic`. `pdftotext -bbox-layout` listed 2030 words on that page. The reference PDF reads `Peoples outlast states` and `No image files are shipped.`

## Fonts that pdffonts listed

Trim poster, tabloid, letter, and the bleed poster, every row `emb=yes`:

- BarlowCondensed-Bold, CID TrueType
- BarlowCondensed-ExtraBold, CID TrueType
- BarlowCondensed-SemiBold, CID TrueType
- BarlowCondensed-SemiBold, Type 3 (stroked axis labels)
- Arimo-Bold, CID TrueType
- SourceSans3ExtraLight-Regular, CID TrueType

Arimo-Bold is Chromium’s fallback for U+2192. That arrow is outside the Barlow unicode-range and remains in ribbon names. SourceSans3ExtraLight-Regular is the PostScript name inside the weight-400 Source Sans 3 woff2. Its OS/2 weight class is 400.

Reference PDF, every row `emb=yes`: BarlowCondensed-ExtraBold, BarlowCondensed-Bold, SourceSans3ExtraLight-Regular, SourceSans3ExtraLight-SemiBold, SourceSerif4-SemiBold. The SemiBold Source Sans name is the weight-600 woff2 (OS/2 weight class 600). Source Serif 4’s woff2 weight class is 600.

## Images

`pdfimages -list` on the trim poster printed the header and no image rows. No plate is shipped. The 300 ppi rule was not applied to a real image.

## Strokes

`npm run check:pdf` on this export:

| File         | Strokes |  Minimum | 0.25 pt floor   |
| ------------ | ------: | -------: | --------------- |
| letter       |     616 | 0.181 pt | not applied     |
| tabloid      |     616 | 0.304 pt | not applied     |
| poster       |     616 | 0.562 pt | applied, passes |
| bleed poster |     624 | 0.500 pt | applied, passes |

Letter is the same drawing reduced onto 8.5 × 11. Those thinner strokes were left as they are. The eight extra bleed strokes are the crop marks.

## 400% crops

Rendered with `pdftoppm -r 288`, which is 4 × 72 dpi. In that crop the callout title “Sumerian city-states” is readable, and so are the ribbon names “Sumerian City-States & Akkadian”, “Early Dynastic Mesopotamia”, “Kura-Araxes”, and “Elam”. The secondary callout line is smaller and still readable in the same crop. This was one field of the poster, not a pass over every label. Letter labels were not judged at 400%.

## Margin and crop marks

The print route pads the sheet by 0.5 in. On the trim poster the topmost extracted word starts at 50.2 pt (0.70 in) from the top edge, and the bottommost ends 51.1 pt (0.71 in) from the bottom edge. The leftmost extracted word is 365 pt in from the left edge, so that figure is not the frame. The 40 dpi render of the full poster shows parchment outside the frame. A 288 dpi crop of the bleed poster’s top-left corner shows two crop marks and a gap at the corner, in the bleed, outside the trim.

## Color

The PDF uses the light-theme parchment `#f1e8d2` and ink `#2a241c`. No contract proof was pulled. That parchment will shift on uncoated stock. A contract proof is needed before a press run.
