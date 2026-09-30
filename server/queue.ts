import { openSession, scrapePerson, type RawPerson, handleFromInstagram, slugFromLinkedIn } from '../src/lib/scraper';
import type { BrowserContext } from 'playwright-core';

let ctxPromise: Promise<BrowserContext> | null = null;
let chain: Promise<any> = Promise.resolve();
export let queueLength = 0;

const getCtx = () => (ctxPromise ??= openSession(process.env.HEADFUL ? false : false).catch((e) => { ctxPromise = null; throw e; }));

export function validateUrls(li: string, ig: string) {
  if (!/^https?:\/\/([a-z]+\.)?linkedin\.com\/in\/[^/?#]+/i.test(li)) throw new Error('LinkedIn URL must look like linkedin.com/in/<name>');
  if (!/^https?:\/\/(www\.)?instagram\.com\/[^/?#]+/i.test(ig)) throw new Error('Instagram URL must look like instagram.com/<handle>');
}

export function scrapeQueued(id: string, li: string, ig: string, onStatus?: (s: string) => void): Promise<RawPerson> {
  validateUrls(li, ig);
  queueLength++;
  onStatus?.(`queued (${queueLength} ahead)`);
  const job = chain.then(async () => {
    try {
      onStatus?.('opening logged-in browser session');
      const ctx = await getCtx();
      onStatus?.('reading LinkedIn + Instagram');
      return await scrapePerson(ctx, id, li, ig, 'data/img');
    } finally { queueLength--; }
  });
  chain = job.catch(() => {});
  return job;
}
export { handleFromInstagram, slugFromLinkedIn };
