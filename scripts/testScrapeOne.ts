import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

async function testOne() {
  const profileDir = '/tmp/brave_scrape_test';
  fs.mkdirSync(path.join(profileDir, 'Default'), { recursive: true });
  
  const srcBase = '/home/anuruprkris/.config/BraveSoftware/Brave-Origin-Beta';
  try {
    fs.copyFileSync(path.join(srcBase, 'Local State'), path.join(profileDir, 'Local State'));
  } catch {}
  try {
    fs.copyFileSync(path.join(srcBase, 'Default', 'Cookies'), path.join(profileDir, 'Default', 'Cookies'));
  } catch {}
  try {
    fs.copyFileSync(path.join(srcBase, 'Default', 'Preferences'), path.join(profileDir, 'Default', 'Preferences'));
  } catch {}

  const browser = await chromium.launchPersistentContext(profileDir, {
    executablePath: '/opt/brave.com/brave-origin-beta/brave',
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  const targetLi = process.argv[2] || 'https://www.linkedin.com/in/cassidoo/';
  const targetIg = process.argv[3] || 'https://www.instagram.com/cassidoo/';

  console.log(`Navigating to ${targetLi}...`);
  await page.goto(targetLi, {
    timeout: 25000,
    waitUntil: 'domcontentloaded',
  });
  await page.waitForTimeout(3000);

  const liText = await page.evaluate(() => {
    return document.body.innerText;
  });
  console.log('LinkedIn text length:', liText.length);
  console.log('LinkedIn sample snippet:\n', liText.slice(0, 500));

  console.log(`Navigating to ${targetIg}...`);
  await page.goto(targetIg, {
    timeout: 25000,
    waitUntil: 'domcontentloaded',
  });

  await page.waitForTimeout(3000);

  const igText = await page.evaluate(() => {
    return document.body.innerText;
  });
  console.log('Instagram text length:', igText.length);
  console.log('Instagram sample snippet:\n', igText.slice(0, 500));

  await browser.close();
}

testOne().catch(console.error);
