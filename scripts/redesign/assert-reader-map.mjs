/* global document */
import assert from 'node:assert/strict';
import { expect } from '@playwright/test';

export async function assertReaderMap(page) {
  await page.emulateMedia({ media: 'print' });
  const readerWidth = await page
    .locator('.reader-print')
    .evaluate((reader) => reader.getBoundingClientRect().width);
  assert.ok(
    Math.abs(readerWidth - ((215.9 - 28) / 25.4) * 96) < 1,
    'Reader uses the Letter page content width before PDF pagination',
  );
  await expect
    .poll(() =>
      page
        .locator('.reader-print .place-map-canvas')
        .evaluateAll((canvases) =>
          canvases.every(
            (canvas) =>
              Math.abs(canvas.clientWidth - Number(canvas.dataset.layoutWidth)) < 1,
          ),
        ),
    )
    .toBe(true);
  const maps = await page
    .locator('.reader-print .place-map-canvas')
    .evaluateAll((canvases) =>
      canvases.map((canvas) => {
        const svg = canvas.querySelector('svg').getBoundingClientRect();
        return {
          heightDifference: Math.abs(canvas.clientHeight - svg.height),
          labels: [...canvas.querySelectorAll('.place-point')].map((marker) => {
            const range = document.createRange();
            range.selectNodeContents(marker);
            const label = range.getBoundingClientRect();
            const box = marker.getBoundingClientRect();
            return {
              text: marker.textContent,
              lines: range.getClientRects().length,
              contained:
                label.left >= box.left &&
                label.right <= box.right &&
                label.top >= box.top &&
                label.bottom <= box.bottom,
            };
          }),
        };
      }),
    );
  for (const map of maps) {
    assert.ok(
      map.heightDifference < 2,
      'Printed map and overlaid locators use the same height',
    );
    assert.ok(
      map.labels.every((label) => label.lines === 1 && label.contained),
      'Printed map labels fit their markers: ' + JSON.stringify(map.labels),
    );
  }
}
