import { URL } from 'node:url';
/* global document */
import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import process from 'node:process';
import { assertReaderMap } from './assert-reader-map.mjs';

const root = process.env.ATLAS_URL;
if (!root)
  throw Error(
    'Use npm run test:browser or npm run axe to start an isolated current-build preview.',
  );
const out = `${process.env.ATLAS_REPORT_DIR}/candidate`;
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch();
const rows = [];
let page;
try {
  for (const width of [320, 390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const externalRequests = [];
    await context.route('**/*', (route) => {
      if (new URL(route.request().url()).origin === new URL(root).origin) {
        const token = new URL(root).hostname.endsWith('.vercel.app')
          ? process.env.VERCEL_OIDC_TOKEN
          : undefined;
        if (token)
          return route.continue({
            headers: {
              ...route.request().headers(),
              'x-vercel-trusted-oidc-idp-token': token,
            },
          });
        return route.continue();
      }
      externalRequests.push(route.request().url());
      return route.abort();
    });
    page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    const visit = async (q = '') => {
      await page.goto(`${root}/${q}`);
      await page.locator('.app-footer').waitFor();
    };
    const axe = async (scenario) => {
      const violations = (await new AxeBuilder({ page }).analyze()).violations;
      await fs.writeFile(
        `${out}/axe-${width}-${scenario}.json`,
        JSON.stringify(violations, null, 2),
      );
      assert.deepEqual(
        violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
        [],
        `${width}/${scenario}`,
      );
      assert.ok(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth + 1,
        ),
        `${width}/${scenario}: page overflow`,
      );
    };
    await visit();
    await expect(page.locator('.living-timeline')).toBeVisible();
    const regionRows = page.locator('.living-region');
    await expect(regionRows).toHaveCount(7);
    for (const row of await regionRows.all()) {
      const count = await row.locator('.living-track').count();
      assert.ok(
        count >= 1 && count <= 4,
        `${width}: one to four cases per home region`,
      );
    }
    await page.locator('.living-preview img').evaluate((image) => image.decode());
    const firstImage = await page.locator('.living-preview img').boundingBox();
    assert.ok(
      firstImage.y < 850,
      `${width}: historical image appears on the first screen`,
    );
    await axe('living-timeline');
    await page.screenshot({ path: `${out}/living-timeline-${width}.png` });
    await page.locator('.living-track[data-subject="roman-world"]').click();
    await expect(page.locator('.living-preview h2')).toBeFocused();
    assert.equal(new URL(page.url()).searchParams.get('subject'), null);
    await page
      .getByRole('button', { name: 'Compare this moment ↗', exact: true })
      .click();
    await expect(page.locator('.meanwhile-view')).toBeVisible();
    await expect(page.locator('.story-preview')).toHaveAttribute(
      'data-preview-subject',
      'roman-world',
    );
    await expect(page.locator('.meanwhile-card')).toHaveCount(7);
    await axe('meanwhile');
    await page.screenshot({ path: `${out}/meanwhile-${width}.png` });
    await page.locator('.meanwhile-card[data-subject="colima"]').click();
    await expect(page.locator('.meanwhile-preview h2')).toBeFocused();
    await page.locator('.meanwhile-preview .preview-read').click();
    await expect(page.locator('.dossier[data-reading-ready=true]')).toBeVisible();
    await expect(page.locator('.dossier h1')).toHaveText('Colima architectural models');
    await page.getByRole('button', { name: '← Back to atlas', exact: true }).click();
    await expect(page.locator('.story-preview')).toHaveAttribute(
      'data-preview-subject',
      'colima',
    );
    assert.equal(new URL(page.url()).searchParams.get('year'), '200 CE');
    assert.equal(new URL(page.url()).searchParams.get('view'), 'world');
    await page.getByRole('button', { name: '← Living timeline', exact: true }).click();
    await expect(page.locator('.living-preview .story-preview')).toHaveAttribute(
      'data-preview-subject',
      'colima',
    );
    await page.locator('.preview-sources > summary').click();
    await expect(page.locator('.preview-sources')).toContainText(
      'The Metropolitan Museum of Art',
    );
    await page.locator('.preview-sources .citations > summary').last().click();
    await expect(
      page.locator('.preview-sources a[href^="https://www.metmuseum.org/"]'),
    ).toBeVisible();
    await axe('preview-sources');
    await visit('?view=timeline');
    await page.locator('.timeline-reference > summary').click();
    await expect(page.locator('.chronology-lane')).toHaveCount(7);
    if (width <= 800) {
      await expect(page.locator('.living-timeline')).toBeVisible();
      await expect(page.locator('.chronology-scroll')).toBeHidden();
      await page
        .getByRole('button', { name: 'Show proportional world timeline', exact: true })
        .click();
    }
    const clippedLabels = await page.locator('.chronology-grid').evaluate((grid) => {
      const right = grid.getBoundingClientRect().right;
      return [...grid.querySelectorAll('.chronology-marker')]
        .filter((button) => button.getBoundingClientRect().right > right + 1)
        .map((button) => button.textContent);
    });
    assert.deepEqual(
      clippedLabels,
      [],
      'End-of-axis labels fit inside the scrollable chronology',
    );
    await axe('overview');
    await page.screenshot({
      path: `${out}/overview-${width}.png`,
      fullPage: width === 1440,
    });
    await visit('?view=timeline&pack=C1&scale=world&year=-3300');
    await page.locator('.date-more > summary').click();
    await expect(page.getByRole('button', { name: /Earlier context/ })).toBeDisabled();
    const slider = page.getByRole('slider', { name: /Move through time/ });
    await slider.focus();
    await slider.press('End');
    await expect(slider).toHaveAttribute('aria-valuetext', '2000 CE');
    assert.equal(
      new URL(page.url()).searchParams.get('year'),
      '-3300',
      'A draft year does not navigate until applied',
    );
    await page.getByRole('button', { name: 'Explore 2000 CE', exact: true }).click();
    await page.locator('.date-more > summary').click();
    await expect(page.getByRole('button', { name: /Later context/ })).toBeDisabled();
    assert.equal(new URL(page.url()).searchParams.get('year'), '2000 CE');
    await page.goBack();
    await expect(page.getByRole('slider')).toHaveAttribute(
      'aria-valuetext',
      '3300 BCE',
    );
    await page.locator('.date-more > summary').click();
    await page.getByRole('button', { name: /Later context/ }).click();
    assert.notEqual(new URL(page.url()).searchParams.get('year'), '3300 BCE');
    await visit('?pack=C4&view=world&year=200&scale=era&region=East%20Asia');
    await page.locator('.map-navigation > summary').click();
    await page.getByRole('button', { name: 'Fit shown places', exact: true }).click();
    assert.ok(
      Number(
        (await page.locator('.map-canvas svg').getAttribute('viewBox')).split(' ')[2],
      ) < 720,
      'Regional places fit a useful extent',
    );
    await page
      .getByLabel('Locate a place', { exact: true })
      .selectOption('eastern-han');
    await expect(page.locator('.story-preview')).toContainText('Eastern Han');
    assert.equal(
      new URL(page.url()).searchParams.get('subject'),
      null,
      'Locating a place keeps the reader in the map',
    );
    const labelContained = await page
      .locator('.map-hit.selected .map-label')
      .evaluate((label) => {
        const a = label.getBoundingClientRect(),
          b = label.closest('.map-canvas').getBoundingClientRect();
        return (
          a.left >= b.left - 1 &&
          a.right <= b.right + 1 &&
          a.top >= b.top - 1 &&
          a.bottom <= b.bottom + 1
        );
      });
    assert.ok(labelContained, 'Focused locator label stays inside the map');
    await axe('focused-geography');
    await page.screenshot({
      path: `${out}/focused-geography-${width}.png`,
      fullPage: false,
    });
    await page.locator('.meanwhile-preview .preview-read').click();
    await expect(page.locator('.dossier[data-reading-ready=true]')).toBeVisible();
    assert.equal(
      new URL(page.url()).searchParams.get('region'),
      'East Asia',
      'An intentional region filter survives opening the reading',
    );
    await visit('?view=world&year=200&scale=era&pack=C4');
    await page.locator('.map-navigation > summary').click();
    await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
    assert.notEqual(
      await page.locator('.map-canvas svg').getAttribute('viewBox'),
      '0 0 720 360',
    );
    await page.getByRole('button', { name: 'Whole world', exact: true }).click();
    await expect(page.locator('.map-canvas svg')).toHaveAttribute(
      'viewBox',
      '0 0 720 360',
    );
    const clustered = await page
      .locator('.map-hit')
      .first()
      .getAttribute('data-cluster');
    await page.locator('.map-hit').first().click();
    if (clustered) await page.locator('.map-cluster-choices button').first().click();
    await page.locator('.meanwhile-preview .preview-read').click();
    await expect(page.locator('.dossier[data-reading-ready=true]')).toBeVisible();
    assert.equal(
      new URL(page.url()).searchParams.get('region'),
      null,
      'opening a subject must not select a region filter',
    );
    await page.locator('.explore-refine > summary').click();
    await page.getByRole('button', { name: 'Full history', exact: true }).click();
    await page.locator('.timeline-reference > summary').click();
    await expect(page.locator('.chronology-overview')).toBeVisible();
    assert.equal(new URL(page.url()).searchParams.get('view'), 'timeline');
    assert.equal(new URL(page.url()).searchParams.get('subject'), null);
    await visit('?view=world&year=1950&scale=era&pack=C8');
    await page.locator('.world-reading-notes > summary').click();
    await expect(page.locator('.reference-contexts')).toContainText(
      'Partition before and after',
    );
    await expect(page.locator('.regional-snapshot')).toHaveCount(7);
    await expect(
      page.locator('.nearby-context').filter({ hasText: '1947' }),
    ).toHaveCount(1);
    await axe('world-1950');
    await page.screenshot({ path: `${out}/world-1950-${width}.png` });
    await visit('?view=world&year=1&scale=era');
    await page.locator('.date-more > summary').click();
    await page.getByRole('button', { name: 'Previous year', exact: true }).click();
    assert.equal(new URL(page.url()).searchParams.get('year'), '1 BCE');
    await page.locator('.date-more > summary').click();
    await page.getByRole('button', { name: 'Next year', exact: true }).click();
    assert.equal(new URL(page.url()).searchParams.get('year'), '1 CE');
    await page.getByRole('button', { name: 'Search the atlas', exact: true }).click();
    const inputPosition = await page.getByRole('searchbox').boundingBox();
    await page.getByRole('searchbox').fill('Buddhism');
    await expect(page.locator('.search-results')).toContainText('Borobudur');
    const resultsPosition = await page.getByRole('searchbox').boundingBox();
    assert.ok(
      Math.abs(resultsPosition.y - inputPosition.y) < 1,
      'the search input must stay in place while results load',
    );
    await page.getByRole('searchbox').fill('frontier monopolies');
    await expect(page.locator('.search-results')).toContainText('Eastern Han');
    await page.getByRole('searchbox').fill('the');
    await expect(page.getByRole('button', { name: /Show more/ })).toBeVisible();
    const before = await page.locator('.search-results button').count();
    await page.getByRole('button', { name: /Show more/ }).click();
    assert.ok((await page.locator('.search-results button').count()) > before);
    await page.keyboard.press('Escape');
    for (const id of ['roman-world', 'eastern-han', 'angkor', 'partition-1947']) {
      await visit(`?subject=${id}&scale=local`);
      await expect(page.locator('.dossier[data-reading-ready=true]')).toBeVisible();
      await expect(page.locator('.dossier h1')).toBeFocused();
      await expect(page.locator('.reference-timeline')).toBeVisible();
      await page.locator('.family-start > summary').click();
      await expect(page.locator('.family-start > ol')).toBeVisible();
      await page
        .locator('.deeper-reading > details')
        .first()
        .locator(':scope > summary')
        .click();
      await expect(
        page.locator('.deeper-reading details').first().locator('p').first(),
      ).toBeVisible();
      await page
        .locator('.dossier-section .citations')
        .first()
        .locator('summary')
        .click();
      await expect(
        page.locator('.dossier-section .source-scope').first(),
      ).toBeVisible();
      if (id === 'angkor' || id === 'partition-1947') {
        await page.locator('.place-index button').last().click();
        await expect(page.locator('.place-explanation h3')).toHaveText(
          id === 'angkor' ? 'Toward Tonle Sap' : 'Mymensingh · East Bengal',
        );
      }
      await axe(id);
      await page.locator('.dossier h1').scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${out}/${id}-${width}.png` });
      if (id === 'roman-world') {
        const compare = page.getByRole('button', {
          name: 'Compare two subjects',
          exact: true,
        });
        await compare.click();
        await expect(page.locator('.comparison-dimension')).toHaveCount(4);
        assert.equal(new URL(page.url()).searchParams.get('compare'), 'eastern-han');
        await axe('rome-han-comparison');
        await page.screenshot({ path: `${out}/rome-han-${width}.png` });
        await page.goBack();
        await expect(compare).toBeFocused();
      }
    }
    if (width === 390) {
      await page
        .getByRole('button', { name: 'Use dark appearance', exact: true })
        .click();
      await page.locator('.place-index button').last().click();
      await axe('dark-place-map');
      await page.screenshot({ path: `${out}/partition-dark-map-390.png` });
      await visit();
      await axe('dark-living');
      await page
        .getByRole('button', { name: 'Compare this moment ↗', exact: true })
        .click();
      await axe('dark-meanwhile');
    }
    assert.deepEqual(errors, []);
    assert.deepEqual(externalRequests, [], 'candidate must be self-contained');
    rows.push({
      width,
      result: 'pass',
      checks: [
        'living timeline first image, selection and sources',
        'meanwhile comparison and exact return context',
        'global overview',
        'map zoom/reset/selection',
        'filter preservation',
        'Full history escape',
        '1950 context and dated nearby cases',
        'BCE/CE transition',
        'concept/body search and pagination',
        'four expanded dossiers',
        'visible source scope',
        'accessible place selection',
        'four-topic Rome/Han comparison',
        'Back restores focus',
        'axe and page overflow',
      ],
    });
    await context.close();
  }
  if (!process.argv.includes('--axe-only')) {
    const context = await browser.newContext({
      viewport: { width: 1100, height: 900 },
    });
    page = await context.newPage();
    for (const id of ['roman-world', 'eastern-han', 'angkor', 'partition-1947']) {
      await page.goto(`${root}/?print=reader&subject=${id}`);
      await page.locator('.reader-bibliography').waitFor();
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all([...document.images].map((i) => i.decode()));
      });
      await assertReaderMap(page);
      await page.pdf({
        path: `${out}/${id}.pdf`,
        preferCSSPageSize: true,
        printBackground: true,
        tagged: true,
      });
    }
    await context.close();
  }
  await fs.writeFile(`${out}/checks.json`, JSON.stringify(rows, null, 2));
  process.stdout.write(
    `Candidate browser checks passed at ${rows.map((r) => r.width).join(', ')}px.\n`,
  );
} catch (error) {
  if (page && !page.isClosed())
    await page.screenshot({ path: `${out}/failure.png`, fullPage: true });
  throw error;
} finally {
  await browser.close();
}
