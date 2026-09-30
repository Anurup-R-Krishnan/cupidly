import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

interface CandidateTest {
  id: string;
  name: string;
  linkedinUrl: string;
  instagramUrl: string;
}

const inputPath = process.argv[2] || path.join(__dirname, '../data/verified_candidates.json');
const CANDIDATES: CandidateTest[] = fs.existsSync(inputPath)
  ? JSON.parse(fs.readFileSync(inputPath, 'utf8'))
  : [];


async function verifyCandidates() {
  const profileDir = '/tmp/brave_scrape_verify';
  fs.mkdirSync(path.join(profileDir, 'Default'), { recursive: true });
  const srcBase = '/home/anuruprkris/.config/BraveSoftware/Brave-Origin-Beta';
  try { fs.copyFileSync(path.join(srcBase, 'Local State'), path.join(profileDir, 'Local State')); } catch {}
  try { fs.copyFileSync(path.join(srcBase, 'Default', 'Cookies'), path.join(profileDir, 'Default', 'Cookies')); } catch {}
  try { fs.copyFileSync(path.join(srcBase, 'Default', 'Preferences'), path.join(profileDir, 'Default', 'Preferences')); } catch {}

  const browser = await chromium.launchPersistentContext(profileDir, {
    executablePath: '/opt/brave.com/brave-origin-beta/brave',
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  const validList: any[] = [];

  for (const c of CANDIDATES) {
    try {
      await page.goto(c.linkedinUrl, { timeout: 15000, waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);
      const liTitle = await page.title();
      const liText = await page.evaluate(() => document.body.innerText);
      const liValid = !liText.includes("page doesn’t exist") && liText.length > 500;

      await page.goto(c.instagramUrl, { timeout: 15000, waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);
      const igText = await page.evaluate(() => document.body.innerText);
      const igValid = !igText.includes("Sorry, this page isn't available") && !igText.includes("This account is private") && igText.length > 300;

      console.log(`[${c.name}] LI: ${liValid ? 'OK (' + liText.length + ' chars)' : 'FAIL'} | IG: ${igValid ? 'OK (' + igText.length + ' chars)' : 'FAIL'}`);

      if (liValid && igValid) {
        validList.push({
          ...c,
          liSnippet: liText.slice(0, 300),
          igSnippet: igText.slice(0, 300),
        });
      }
    } catch (err: any) {
      console.log(`[${c.name}] Error: ${err.message}`);
    }
  }

  console.log(`Total valid candidates found: ${validList.length} / ${CANDIDATES.length}`);
  fs.writeFileSync('data/verified_candidates.json', JSON.stringify(validList, null, 2));
  await browser.close();
}

verifyCandidates().catch(console.error);
