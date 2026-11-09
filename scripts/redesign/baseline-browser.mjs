import { chromium } from 'playwright';
const browser = await chromium.launch();
try {
  for (const [name, width, height] of [
    ['desktop', 1440, 900],
    ['tablet', 768, 1024],
    ['phone', 390, 844],
  ]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto('http://127.0.0.1:4173');
    await page.screenshot({ path: `output/redesign/baseline/${name}.png` });
    await page.close();
  }
} finally {
  await browser.close();
}
