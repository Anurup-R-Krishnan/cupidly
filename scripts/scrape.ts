import fs from 'fs';
import { openSession, scrapePerson } from '../src/lib/scraper';

const input = process.argv[2] || 'data/people.json';
const only = process.argv.slice(3);
const people: { id: string; name: string; linkedinUrl: string; instagramUrl: string }[] = JSON.parse(fs.readFileSync(input, 'utf8'));
fs.mkdirSync('data/raw', { recursive: true });

const ctx = await openSession(false);
for (const p of people) {
  if (only.length && !only.includes(p.id)) continue;
  const out = `data/raw/${p.id}.json`;
  if (!only.length && fs.existsSync(out) && JSON.parse(fs.readFileSync(out, 'utf8')).linkedin?.ok) { console.log('skip', p.id); continue; }
  console.log('scraping', p.id);
  const raw = await scrapePerson(ctx, p.id, p.linkedinUrl, p.instagramUrl, 'data/img');
  fs.writeFileSync(out, JSON.stringify(raw, null, 2));
  console.log(`  LI ok=${raw.linkedin.ok} (${raw.linkedin.text.length}c) ${raw.linkedin.error || ''} | IG ok=${raw.instagram.ok} posts=${raw.instagram.posts.length} private=${raw.instagram.isPrivate} ${raw.instagram.error || ''}`);
}
await ctx.close();
