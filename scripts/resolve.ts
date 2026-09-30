import fs from 'fs';
import { openSession } from '../src/lib/scraper';

const cands: { name: string; hint?: string }[] = JSON.parse(fs.readFileSync(process.argv[2] || 'data/candidates.json', 'utf8'));
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z ]/g, '').trim();
const sim = (a: string, b: string) => {
  const A = new Set(norm(a).split(/\s+/)), B = norm(b).split(/\s+/);
  return B.filter((w) => A.has(w)).length / Math.max(A.size, B.length);
};
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const ctx = await openSession(false);
const page = await ctx.newPage();
await page.goto('https://www.instagram.com/', { waitUntil: 'domcontentloaded' });
await sleep(2500);

const out: any[] = fs.existsSync('data/resolved.json') ? JSON.parse(fs.readFileSync('data/resolved.json', 'utf8')) : [];
const done = new Set(out.map((o) => o.name));

for (const c of cands) {
  if (done.has(c.name)) continue;
  const rec: any = { name: c.name, hint: c.hint };
  try {
    const r = await page.evaluate(async (q) => {
      const res = await fetch(`/web/search/topsearch/?context=blended&query=${encodeURIComponent(q)}&include_reel=false`, { headers: { 'x-ig-app-id': '936619743392459' }, credentials: 'include' });
      return res.ok ? res.json() : { status: res.status };
    }, c.name);
    const users = (r.users || []).map((u: any) => u.user).filter(Boolean);
    const best = users.map((u: any) => ({ u, s: sim(c.name, u.full_name || '') + (u.is_verified ? 0.3 : 0) })).sort((a: any, b: any) => b.s - a.s)[0];
    if (best && best.s >= 0.9) rec.instagram = { handle: best.u.username, fullName: best.u.full_name, verified: !!best.u.is_verified, private: !!best.u.is_private, url: `https://www.instagram.com/${best.u.username}/` };
    else rec.igNote = `no confident IG match; top: ${users.slice(0, 3).map((u: any) => u.username + '/' + u.full_name).join(', ')}`;
  } catch (e: any) { rec.igNote = String(e.message); }
  await sleep(1500 + Math.random() * 1500);
  try {
    const q = encodeURIComponent(`${c.name} ${c.hint || ''}`.trim());
    await page.goto(`https://www.linkedin.com/search/results/people/?keywords=${q}`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('main', { timeout: 15000 });
    await sleep(2500);
    const hits: { href: string; text: string }[] = await page.locator('main a[href*="/in/"]').evaluateAll((els) =>
      els.map((e) => ({ href: (e as HTMLAnchorElement).href.split('?')[0], text: (e as HTMLElement).innerText.split('\n')[0].trim() })).filter((h) => h.text),
    );
    const b = hits.map((h) => ({ ...h, s: sim(c.name, h.text.replace(/View .*profile/i, '')) })).sort((a, b) => b.s - a.s)[0];
    if (b && b.s >= 0.9) rec.linkedin = { url: b.href, listedName: b.text };
    else rec.liNote = `no confident LI match; ${hits.slice(0, 3).map((h) => h.text).join(', ')}`;
  } catch (e: any) { rec.liNote = String(e.message); }
  out.push(rec);
  fs.writeFileSync('data/resolved.json', JSON.stringify(out, null, 2));
  console.log(c.name, '| IG:', rec.instagram?.handle ?? rec.igNote, rec.instagram?.private ? '(private)' : '', '| LI:', rec.linkedin?.url ?? rec.liNote);
  await sleep(2500 + Math.random() * 2500);
}
await ctx.close();
