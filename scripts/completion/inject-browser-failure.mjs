// Test-only preload: fail the first navigation in an actual browser script.
import { chromium } from 'playwright';
import fs from 'node:fs';
import process from 'node:process';
const marker = process.env.CHRONOS_CLEANUP_MARKER;
if (!marker) throw Error('Cleanup marker is required');
const launch = chromium.launch.bind(chromium);
const sabotage = (page) => {
  page.goto = async () => {
    throw Error('CHRONOS_INJECTED_NAVIGATION_FAILURE');
  };
  return page;
};
chromium.launch = async (...args) => {
  const browser = await launch(...args);
  fs.appendFileSync(marker, 'launched\n');
  browser.on('disconnected', () => fs.appendFileSync(marker, 'closed\n'));
  const page = browser.newPage.bind(browser);
  browser.newPage = async (...args) => sabotage(await page(...args));
  const context = browser.newContext.bind(browser);
  browser.newContext = async (...args) => {
    const created = await context(...args);
    const page = created.newPage.bind(created);
    created.newPage = async (...args) => sabotage(await page(...args));
    return created;
  };
  return browser;
};
