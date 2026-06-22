import { chromium } from 'playwright';

const routes = [
  ['http://127.0.0.1:3010', 'screenshots/01-landing.png', '.page-shell'],
  ['http://127.0.0.1:3010/dashboard', 'screenshots/02-dashboard.png', '.app-layout'],
  ['http://127.0.0.1:3010/billing', 'screenshots/03-billing.png', '.app-layout'],
  ['http://127.0.0.1:3010/api-keys', 'screenshots/04-api-keys.png', '.app-layout'],
  ['http://127.0.0.1:3010/audit-logs', 'screenshots/05-audit-logs.png', '.app-layout'],
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });

for (const [url, file, selector] of routes) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
  await page.evaluate(async () => {
    // @ts-ignore
    if (document.fonts?.ready) await document.fonts.ready;
  });
  await page.waitForTimeout(1200);
  const loc = page.locator(selector).first();
  await loc.screenshot({ path: file });
}

await browser.close();
