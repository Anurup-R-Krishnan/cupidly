import fs from 'fs';

export interface LLMImage { path: string }
const ANTHROPIC_KEY = () => process.env.ANTHROPIC_API_KEY;
const GEMINI_KEY = () => process.env.GEMINI_API_KEY || process.env.API_KEY;

export const llmAvailable = () => !!(ANTHROPIC_KEY() || GEMINI_KEY());
export const llmProvider = () => (ANTHROPIC_KEY() ? 'anthropic' : GEMINI_KEY() ? 'gemini' : 'none');

function extractJSON(text: string): any {
  const t = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  try { return JSON.parse(t); } catch {}
  const s = t.indexOf('{'), e = t.lastIndexOf('}');
  if (s >= 0 && e > s) return JSON.parse(t.slice(s, e + 1));
  throw new Error('LLM returned non-JSON');
}

export async function llmJSON<T = any>(system: string, user: string, opts: { images?: LLMImage[]; maxTokens?: number; fast?: boolean } = {}): Promise<T> {
  let lastErr: any;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const text = ANTHROPIC_KEY() ? await callAnthropic(system, user, opts) : await callGemini(system, user, opts);
      return extractJSON(text) as T;
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
  throw lastErr;
}

function imgs(images: LLMImage[] = []) {
  return images.filter((i) => fs.existsSync(i.path)).slice(0, 8).map((i) => fs.readFileSync(i.path).toString('base64'));
}

async function callAnthropic(system: string, user: string, opts: any): Promise<string> {
  const content: any[] = imgs(opts.images).map((data) => ({ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data } }));
  content.push({ type: 'text', text: user });
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': ANTHROPIC_KEY()!, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || (opts.fast ? 'claude-haiku-4-5-20251001' : 'claude-sonnet-5-5'), max_tokens: opts.maxTokens || 3000, system, messages: [{ role: 'user', content }] }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const j: any = await res.json();
  return j.content?.map((c: any) => c.text || '').join('') || '';
}

async function callGemini(system: string, user: string, opts: any): Promise<string> {
  const parts: any[] = imgs(opts.images).map((data) => ({ inlineData: { mimeType: 'image/jpeg', data } }));
  parts.push({ text: user });
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY()}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents: [{ role: 'user', parts }], generationConfig: { responseMimeType: 'application/json', maxOutputTokens: opts.maxTokens || 3000 } }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const j: any = await res.json();
  return j.candidates?.[0]?.content?.parts?.map((p: any) => p.text || '').join('') || '';
}
