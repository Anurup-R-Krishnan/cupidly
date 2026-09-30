import fs from 'fs';
import { openSession } from '../src/lib/scraper';
const res: any[] = JSON.parse(fs.readFileSync('data/resolved.json', 'utf8'));
const G: Record<string, string[]> = {
  'Cassidy Williams': ['cassidoo'], 'Ali Abdaal': ['aliabdaal'], 'Sahil Bloom': ['sahilbloom'], 'Justin Welsh': ['thejustinwelsh', 'justinwelsh'], 'Codie Sanchez': ['codiesanchez'],
  'Alex Hormozi': ['alexhormozi'], 'Steven Bartlett': ['steven'], 'Mel Robbins': ['melrobbins'], 'Simon Sinek': ['simonsinek'], 'Adam Grant': ['adamgrant'], 'Jay Shetty': ['jayshetty'],
  'Kevin Systrom': ['kevin'], 'Whitney Wolfe Herd': ['whitneywolfeherd'], 'Sara Blakely': ['sarablakely'], 'Reid Hoffman': ['reidhoffman'], 'Nikhil Kamath': ['nikhilkamathcio'],
  'Ranveer Allahbadia': ['beerbiceps'], 'Kunal Shah': ['kunalshah'], 'Bhavish Aggarwal': ['bhavish.aggarwal', 'bhavishaggarwal'], 'Ritesh Agarwal': ['riteshagar'], 'Falguni Nayar': ['falgunink'],
  'Ankur Warikoo': ['warikoo'], 'Deepinder Goyal': ['deepigoyal'], 'Sandeep Maheshwari': ['sandeepmaheshwari', 'sandeep_maheshwari'], 'Ghazal Alagh': ['ghazalalagh'], 'Vineeta Singh': ['vineetasingh'],
  'Aman Gupta': ['boatxaman', 'amangupta0'], 'Namita Thapar': ['namitathapar'], 'Radhika Gupta': ['radhikagupta'], 'Marques Brownlee': ['mkbhd'], 'Gary Vaynerchuk': ['garyvee'],
  'Arianna Huffington': ['ariannahuff'], 'Brene Brown': ['brenebrown'], 'Melinda French Gates': ['melindafrenchgates'], 'Sundar Pichai': ['sundarpichai'], 'Satya Nadella': ['satyanadella'],
  'Ryan Holiday': ['ryanholiday'], 'Tim Ferriss': ['tferriss'], 'Emily Weiss': ['emilyweiss'], 'Neil Patel': ['neilpatel'], 'Guy Kawasaki': ['guykawasaki'], 'Scott Galloway': ['profgalloway'],
  'Vishen Lakhiani': ['vishenl'], 'Tanmay Bhat': ['tanmaybhat'], 'Prajakta Koli': ['mostlysane'], 'Kusha Kapila': ['kushakapila'], 'Shradha Sharma': ['shradhasharma'], 'Sneha Jain': ['snehajain'],
  'Ashneer Grover': ['ashneer.grover'], 'Anupam Mittal': ['anupammittal'],
};
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z ]/g, '').trim();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const ctx = await openSession(false);
const page = await ctx.newPage();
const num = (s: string) => { const m = s.replace(/,/g, '').match(/([\d.]+)\s*([km])?/i); if (!m) return 0; return Math.round(parseFloat(m[1]) * ({ k: 1e3, m: 1e6 } as any)[(m[2] || '').toLowerCase()] || parseFloat(m[1])); };
for (const r of res) {
  if (r.instagram || !G[r.name]) continue;
  for (const g of G[r.name]) {
    await page.goto(`https://www.instagram.com/${g}/`, { waitUntil: 'domcontentloaded' }).catch(() => {});
    await sleep(3500 + Math.random() * 1500);
    const head = (await page.locator('header').first().innerText({ timeout: 6000 }).catch(() => '')).replace(/\n/g, ' | ');
    const title = await page.title();
    if (!head) continue;
    const toks = norm(r.name).split(' ');
    const hn = norm(head + ' ' + title);
    const hits = toks.filter((t) => t.length > 2 && hn.includes(t)).length;
    const posts = num((head.match(/([\d.,]+[km]?)\s*posts/i) || [])[1] || '0');
    const priv = /account is private/i.test(await page.locator('main').first().innerText().catch(() => ''));
    if (hits >= 1 && posts > 5) {
      r.instagram = { handle: g, url: `https://www.instagram.com/${g}/`, header: head.slice(0, 220), private: priv, posts, nameHits: hits };
      break;
    }
  }
  console.log(r.name, '->', r.instagram ? `${r.instagram.handle} priv=${r.instagram.private} posts=${r.instagram.posts} :: ${r.instagram.header.slice(0, 70)}` : 'NONE');
  fs.writeFileSync('data/resolved.json', JSON.stringify(res, null, 2));
}
await ctx.close();
