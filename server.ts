import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';
import { AgentProfile, DateResult } from './src/types';
import { scrapeQueued, validateUrls, handleFromInstagram, slugFromLinkedIn } from './server/queue';
import { analyzePerson } from './server/analyze';
import { runDate } from './server/date';
import { llmAvailable, llmProvider } from './server/llm';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const readJSON = <T,>(f: string, d: T): T => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };
const demoProfiles = () => readJSON<AgentProfile[]>('data/profiles.json', []);
const demoDates = () => readJSON<Record<string, any>>('data/dates.json', {});
let customProfiles: AgentProfile[] = readJSON('data/custom-profiles.json', []);
const saveCustom = () => { try { fs.writeFileSync('data/custom-profiles.json', JSON.stringify(customProfiles, null, 1)); } catch { } };
const allProfiles = () => [...customProfiles, ...demoProfiles()];

app.get('/api/health', (_req, res) => res.json({ ok: true, llm: llmProvider(), profiles: allProfiles().length }));
app.use('/img', express.static(path.resolve('data/img')));

app.get('/api/profiles', (_req, res) => res.json({ profiles: allProfiles() }));
app.get('/api/dates', (_req, res) => res.json({ dates: demoDates() }));
app.get('/api/demo', (_req, res) => res.json({ profiles: demoProfiles(), dates: demoDates() }));

app.post('/api/ingest', async (req, res) => {
  try {
    const { name, linkedinUrl, instagramUrl } = req.body || {};
    if (!linkedinUrl || !instagramUrl) return res.status(400).json({ error: 'Both a LinkedIn and an Instagram URL are required.' });
    validateUrls(linkedinUrl, instagramUrl);
    if (!llmAvailable()) return res.status(503).json({ error: 'Server has no LLM key configured (ANTHROPIC_API_KEY or GEMINI_API_KEY).' });
    const id = handleFromInstagram(instagramUrl) || slugFromLinkedIn(linkedinUrl);
    const raw = await scrapeQueued(id, linkedinUrl, instagramUrl);
    if (!raw.linkedin.ok && !raw.instagram.ok) {
      return res.status(422).json({ error: `Could not read either source. LinkedIn: ${raw.linkedin.error}. Instagram: ${raw.instagram.error}.`, raw: { linkedin: raw.linkedin.error, instagram: raw.instagram.error } });
    }
    fs.mkdirSync('data/raw', { recursive: true });
    fs.writeFileSync(`data/raw/${id}.json`, JSON.stringify(raw, null, 1));
    const profile = await analyzePerson(id, name, raw);
    if (profile.avatarUrl === '' && raw.instagram.posts[0]?.localImage) profile.avatarUrl = '/' + raw.instagram.posts[0].localImage.replace(/^data\//, '');
    customProfiles = [profile, ...customProfiles.filter((p) => p.id !== id)];
    saveCustom();
    res.json({ profile, warnings: [raw.linkedin.ok ? '' : `LinkedIn: ${raw.linkedin.error}`, raw.instagram.ok ? '' : `Instagram: ${raw.instagram.error}`].filter(Boolean) });
  } catch (err: any) {
    console.error('ingest error:', err);
    res.status(500).json({ error: err.message || 'Failed to ingest profile' });
  }
});

app.post('/api/date/stream', async (req, res) => {
  const { agentAId, agentBId } = req.body || {};
  const A = allProfiles().find((p) => p.id === agentAId), B = allProfiles().find((p) => p.id === agentBId);
  if (!A || !B) return res.status(404).json({ error: 'Unknown agent id' });
  res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
  const send = (event: string, data: any) => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  try {
    const cached = demoDates().find((d: DateResult) => (d.agentAId === A.id && d.agentBId === B.id) || (d.agentAId === B.id && d.agentBId === A.id));
    const result = cached && req.body.useCache ? cached : await runDate(A, B, (t) => send('turn', t));
    if (cached && req.body.useCache) for (const t of cached.turns) send('turn', t);
    send('done', result);
  } catch (e: any) { send('error', { error: e.message }); }
  res.end();
});

app.post('/api/date', async (req, res) => {
  try {
    const { agentA, agentB } = req.body;
    if (!agentA || !agentB) return res.status(400).json({ error: 'Both agent profiles are required.' });
    res.json({ dateResult: await runDate(agentA, agentB) });
  } catch (err: any) { res.status(500).json({ error: err.message || 'Date simulation failed' }); }
});

async function setupServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => res.sendFile(path.resolve(__dirname, 'dist/index.html')));
  }
  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, '0.0.0.0', () => console.log(`Cupidly running at http://0.0.0.0:${PORT}`));
}

if (!process.env.VERCEL) {
  setupServer().catch((err) => { console.error('Failed to start server:', err); process.exit(1); });
}

export default app;
