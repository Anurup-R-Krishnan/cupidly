import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const inputPath = process.argv[2] || path.join(__dirname, '../data/new_public_candidates.json');
const PUBLIC_POOL: any[] = fs.existsSync(inputPath)
  ? JSON.parse(fs.readFileSync(inputPath, 'utf8'))
  : [];


async function checkPool() {
  const profileDir = '/tmp/brave_scrape_verify';
  const browser = await chromium.launchPersistentContext(profileDir, {
    executablePath: '/opt/brave.com/brave-origin-beta/brave',
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  const confirmedPublic: any[] = [];

  for (const c of PUBLIC_POOL) {
    try {
      await page.goto(c.linkedinUrl, { timeout: 15000, waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);
      const liText = await page.evaluate(() => document.body.innerText);
      const liValid = !liText.includes("page doesn’t exist") && liText.length > 500;

      await page.goto(c.instagramUrl, { timeout: 15000, waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);
      const igText = await page.evaluate(() => document.body.innerText);
      const igValid = !igText.includes("Sorry, this page isn't available") && !igText.includes("This profile is private") && !igText.includes("No posts yet") && igText.length > 300;

      console.log(`[${c.name}] LI: ${liValid ? 'OK (' + liText.length + ' chars)' : 'FAIL'} | IG: ${igValid ? 'OK (' + igText.length + ' chars)' : 'FAIL'}`);

      if (liValid && igValid) {
        confirmedPublic.push(c);
      }
    } catch (e: any) {
      console.log(`[${c.name}] Err: ${e.message}`);
    }
  }

  console.log(`Confirmed new public count: ${confirmedPublic.length}`);
  fs.writeFileSync('data/new_public_candidates.json', JSON.stringify(confirmedPublic, null, 2));
  await browser.close();
}

checkPool().catch(console.error);
