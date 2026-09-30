import { chromium, type BrowserContext, type Page } from 'playwright-core';
import fs from 'fs';
import os from 'os';
import path from 'path';

export interface RawLinkedIn {
  url: string;
  ok: boolean;
  name: string;
  headline: string;
  location: string;
  text: string;
  experience: string;
  posts: string;
  error?: string;
}

export interface RawInstagram {
  url: string;
  ok: boolean;
  handle: string;
  isPrivate: boolean;
  name: string;
  bio: string;
  stats: string;
  externalLinks: string[];
  avatar: string;
  posts: { url: string; caption: string; alt: string; image: string; localImage?: string; date?: string; location?: string }[];
  error?: string;
}

export interface RawPerson {
  id: string;
  linkedin: RawLinkedIn;
  instagram: RawInstagram;
  scrapedAt: string;
}

const BRAVE = process.env.BRAVE_PATH || '/opt/brave.com/brave-origin-beta/brave';
const BRAVE_PROFILE = process.env.BRAVE_PROFILE || path.join(os.homedir(), '.config/BraveSoftware/Brave-Origin-Beta');

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const jitter = (min = 1500, max = 3500) => sleep(min + Math.random() * (max - min));

export async function openSession(headless = false): Promise<BrowserContext> {
  if (process.env.LI_AT && process.env.IG_SESSIONID) {
    const ctx = await chromium.launchPersistentContext(fs.mkdtempSync(path.join(os.tmpdir(), 'cupidly-env-')), {
      executablePath: process.env.CHROMIUM_PATH || (fs.existsSync(BRAVE) ? BRAVE : undefined),
      headless: process.env.HEADFUL ? false : true,
      viewport: { width: 1360, height: 1000 },
    });
    await ctx.addCookies([
      { name: 'li_at', value: process.env.LI_AT, domain: '.linkedin.com', path: '/', secure: true, httpOnly: true, sameSite: 'None' },
      { name: 'sessionid', value: process.env.IG_SESSIONID, domain: '.instagram.com', path: '/', secure: true, httpOnly: true, sameSite: 'None' },
    ]);
    return ctx;
  }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cupidly-prof-'));
  fs.mkdirSync(path.join(dir, 'Default'), { recursive: true });
  fs.copyFileSync(path.join(BRAVE_PROFILE, 'Local State'), path.join(dir, 'Local State'));
  for (const f of ['Cookies', 'Preferences']) {
    fs.copyFileSync(path.join(BRAVE_PROFILE, 'Default', f), path.join(dir, 'Default', f));
  }
  return chromium.launchPersistentContext(dir, {
    executablePath: BRAVE,
    headless,
    viewport: { width: 1360, height: 1000 },
    args: ['--password-store=gnome-libsecret'],
  });
}

export function slugFromLinkedIn(url: string): string {
  return (url.match(/linkedin\.com\/in\/([^/?#]+)/i)?.[1] || '').toLowerCase();
}
export function handleFromInstagram(url: string): string {
  return (url.match(/instagram\.com\/([^/?#]+)/i)?.[1] || '').replace(/^@/, '').toLowerCase();
}

export async function scrapeLinkedIn(page: Page, url: string): Promise<RawLinkedIn> {
  const out: RawLinkedIn = { url, ok: false, name: '', headline: '', location: '', text: '', experience: '', posts: '' };
  try {
    const base = `https://www.linkedin.com/in/${slugFromLinkedIn(url)}/`;
    await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('main', { timeout: 15000 });
    await jitter(1500, 2500);
    if (/authwall|login|signup/.test(page.url())) throw new Error('LinkedIn auth wall (not logged in / blocked)');
    for (let i = 0; i < 6; i++) {
      await page.mouse.wheel(0, 1400);
      await sleep(500);
    }
    out.name = ((await page.locator('main h1, main h2').first().innerText().catch(() => '')) || '').trim();
    out.text = (await page.locator('main').first().innerText().catch(() => '')).replace(/\n{3,}/g, '\n\n');
    const lines = out.text.split('\n').map((l) => l.trim()).filter(Boolean);
    const ni = lines.findIndex((l) => l === out.name);
    out.headline = lines.slice(ni + 1).find((l) => l.length > 15 && !/^·|degree connection|^\d/.test(l)) || '';

    try {
      await jitter();
      await page.goto(`${base}details/experience/`, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await sleep(2000);
      out.experience = (await page.locator('main').first().innerText()).replace(/\n{3,}/g, '\n\n');
    } catch {}
    try {
      await jitter();
      await page.goto(`${base}recent-activity/all/`, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await sleep(2500);
      for (let i = 0; i < 3; i++) { await page.mouse.wheel(0, 1600); await sleep(600); }
      out.posts = (await page.locator('main').first().innerText()).replace(/\n{3,}/g, '\n\n').slice(0, 9000);
    } catch {}
    out.ok = out.text.length > 200;
    if (!out.ok) out.error = 'Profile text too short / not visible';
  } catch (e: any) {
    out.error = String(e?.message || e);
  }
  return out;
}

export async function scrapeInstagram(page: Page, url: string, imgDir?: string, maxPosts = 9): Promise<RawInstagram> {
  const handle = handleFromInstagram(url);
  const out: RawInstagram = { url, ok: false, handle, isPrivate: false, name: '', bio: '', stats: '', externalLinks: [], avatar: '', posts: [] };
  try {
    await page.goto(`https://www.instagram.com/${handle}/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('header', { timeout: 15000 });
    await jitter(1500, 2500);
    const header = await page.locator('header').first().innerText();
    out.isPrivate = /This account is private/i.test(await page.locator('main').first().innerText().catch(() => ''));
    const hl = header.split('\n').map((l) => l.trim()).filter(Boolean);
    out.stats = hl.filter((l) => /(posts|followers|following)/i.test(l)).join(' | ');
    out.name = hl.find((l) => l.toLowerCase() !== handle && !/(posts|followers|following|follow|message|^\d)/i.test(l)) || '';
    out.bio = hl.filter((l) => !/^(follow|following|message|\d[\d.,KMkm]*$)/i.test(l) && !/(posts|followers|following)$/i.test(l) && l.toLowerCase() !== handle).join('\n');
    out.externalLinks = await page.locator('header a[href]:not([href^="/"])').evaluateAll((els) =>
      els.map((e) => (e as HTMLAnchorElement).href).filter((h) => !h.includes('instagram.com')),
    ).catch(() => []);
    out.avatar = await page.locator('header img').first().getAttribute('src').catch(() => '') || '';
    if (out.isPrivate) { out.error = 'Private account'; return out; }

    for (let i = 0; i < 3; i++) { await page.mouse.wheel(0, 1200); await sleep(500); }
    const links: string[] = await page.locator('a[href*="/p/"], a[href*="/reel/"]').evaluateAll((els) =>
      Array.from(new Set(els.map((e) => (e as HTMLAnchorElement).href))),
    );
    for (const link of links.slice(0, maxPosts)) {
      try {
        await jitter(1200, 2600);
        await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 20000 });
        await page.waitForSelector('article, main', { timeout: 10000 });
        await sleep(800);
        const post = await page.evaluate(() => {
          const art = document.querySelector('article') || document.querySelector('main');
          const h1 = art?.querySelector('h1')?.textContent || '';
          const img = (art?.querySelector('img[src*="cdninstagram"], img[src*="fbcdn"]') as HTMLImageElement | null);
          const time = art?.querySelector('time') as HTMLTimeElement | null;
          const loc = (art?.querySelector('a[href*="/explore/locations/"]') as HTMLAnchorElement | null)?.textContent || '';
          return { caption: h1.trim(), alt: img?.alt || '', image: img?.src || '', date: time?.dateTime || '', location: loc };
        });
        const rec: RawInstagram['posts'][number] = { url: link, ...post };
        if (imgDir && rec.image) {
          try {
            fs.mkdirSync(imgDir, { recursive: true });
            const buf = Buffer.from(await (await page.request.get(rec.image)).body());
            const f = path.join(imgDir, `${out.posts.length}.jpg`);
            fs.writeFileSync(f, buf);
            rec.localImage = f;
          } catch {}
        }
        out.posts.push(rec);
      } catch {}
    }
    out.ok = out.bio.length > 0 || out.posts.length > 0;
    if (!out.ok) out.error = 'No bio or posts readable';
  } catch (e: any) {
    out.error = String(e?.message || e);
  }
  return out;
}

export async function scrapeInstagramHTTP(url: string): Promise<RawInstagram> {
  const handle = handleFromInstagram(url);
  const out: RawInstagram = { url, ok: false, handle, isPrivate: false, name: '', bio: '', stats: '', externalLinks: [], avatar: '', posts: [] };
  try {
    const res = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${handle}`, {
      headers: {
        'x-ig-app-id': '936619743392459',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    if (res.ok) {
      const data = await res.json();
      const u = data?.data?.user;
      if (u) {
        out.name = u.full_name || '';
        out.bio = u.biography || '';
        out.avatar = u.profile_pic_url_hd || u.profile_pic_url || '';
        out.isPrivate = !!u.is_private;
        out.stats = `${u.edge_owner_to_timeline_media?.count || 0} posts | ${u.edge_followed_by?.count || 0} followers`;
        out.externalLinks = u.external_url ? [u.external_url] : [];
        const edges = u.edge_owner_to_timeline_media?.edges || [];
        out.posts = edges.slice(0, 9).map((e: any) => ({
          url: `https://www.instagram.com/p/${e.node?.shortcode}/`,
          caption: e.node?.edge_media_to_caption?.edges?.[0]?.node?.text || '',
          alt: e.node?.accessibility_caption || '',
          image: e.node?.display_url || '',
          date: e.node?.taken_at_timestamp ? new Date(e.node.taken_at_timestamp * 1000).toISOString() : '',
        }));
        out.ok = out.bio.length > 0 || out.posts.length > 0;
        return out;
      }
    }
  } catch (err: any) {
    out.error = String(err?.message || err);
  }
  return out;
}

export async function scrapeLinkedInHTTP(url: string): Promise<RawLinkedIn> {
  const out: RawLinkedIn = { url, ok: false, name: '', headline: '', location: '', text: '', experience: '', posts: '' };
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      },
    });
    const html = await res.text();
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) {
      const parts = titleMatch[1].split(/[|-]/).map((p) => p.trim());
      out.name = parts[0] || '';
      out.headline = parts[1] || '';
    }
    const ogDesc = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i) || html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
    if (ogDesc) {
      out.text = ogDesc[1];
      if (!out.headline) out.headline = ogDesc[1].slice(0, 100);
    }
    out.ok = out.name.length > 0 || out.text.length > 0;
  } catch (err: any) {
    out.error = String(err?.message || err);
  }
  return out;
}

export async function scrapePersonHTTP(id: string, linkedinUrl: string, instagramUrl: string): Promise<RawPerson> {
  const [linkedin, instagram] = await Promise.all([
    scrapeLinkedInHTTP(linkedinUrl),
    scrapeInstagramHTTP(instagramUrl),
  ]);
  return { id, linkedin, instagram, scrapedAt: new Date().toISOString() };
}

export async function scrapePerson(ctx: BrowserContext, id: string, linkedinUrl: string, instagramUrl: string, imgRoot?: string): Promise<RawPerson> {
  const page = await ctx.newPage();
  try {
    const linkedin = await scrapeLinkedIn(page, linkedinUrl);
    await jitter(2000, 4000);
    const instagram = await scrapeInstagram(page, instagramUrl, imgRoot ? path.join(imgRoot, id) : undefined);
    return { id, linkedin, instagram, scrapedAt: new Date().toISOString() };
  } finally {
    await page.close().catch(() => {});
  }
}
