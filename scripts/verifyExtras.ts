import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const inputPath = process.argv[2] || path.join(__dirname, '../data/test.json');
const EXTRA_CANDIDATES: any[] = fs.existsSync(inputPath)
  ? JSON.parse(fs.readFileSync(inputPath, 'utf8'))
  : [];


async function verifyExtras() {
  const profileDir = '/tmp/brave_scrape_verify';
  const browser = await chromium.launchPersistentContext(profileDir, {
    executablePath: '/opt/brave.com/brave-origin-beta/brave',
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  const validExtras: any[] = [];

  for (const c of EXTRA_CANDIDATES) {
    try {
      await page.goto(c.linkedinUrl, { timeout: 15000, waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);
      const liText = await page.evaluate(() => document.body.innerText);
      const liValid = !liText.includes("page doesn’t exist") && liText.length > 500;

      await page.goto(c.instagramUrl, { timeout: 15000, waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);
      const igText = await page.evaluate(() => document.body.innerText);
      const igValid = !igText.includes("Sorry, this page isn't available") && !igText.includes("This account is private") && igText.length > 300;

      console.log(`[${c.name}] LI: ${liValid ? 'OK (' + liText.length + ' chars)' : 'FAIL'} | IG: ${igValid ? 'OK (' + igText.length + ' chars)' : 'FAIL'}`);

      if (liValid && igValid) {
        validExtras.push({
          ...c,
          liSnippet: liText.slice(0, 300),
          igSnippet: igText.slice(0, 300),
        });
      }
    } catch (err: any) {
      console.log(`[${c.name}] Error: ${err.message}`);
    }
  }

  const existing = JSON.parse(fs.readFileSync('data/verified_candidates.json', 'utf8') || '[]');
  const combined = [...existing, ...validExtras];
  fs.writeFileSync('data/verified_candidates.json', JSON.stringify(combined, null, 2));
  console.log(`Updated verified candidates count: ${combined.length}`);

  await browser.close();
}

verifyExtras().catch(console.error);
