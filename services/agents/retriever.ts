import { youSearch, youNews } from '../../packages/you-client';
import { URL } from 'node:url';

const OFFICIAL_HINTS = ['privacy','policy','terms','security','compliance','retention','deletion'];

export function buildQueries(vendor: string, topic: string) {
  const base = `site:${vendor} (${topic})`;
  const withOps = [
    `${base} ("privacy policy" OR "terms of service" OR "data retention" OR deletion)`,
    `${base} (pdf OR documentation OR manual)`,
  ];
  return withOps;
}

export function domainOf(u: string) {
  try { return new URL(u).hostname.replace(/^www\./,''); } catch { return ''; }
}

export function rankByTrust(a: any[]) {
  // naive: official domain > pdf > has lastModified > has OFFICIAL_HINTS
  return a.sort((x, y) => (y.trustScore ?? 0) - (x.trustScore ?? 0));
}

export async function retrieve(apiKey: string, vendorDomain: string, topic: string) {
  const queries = buildQueries(vendorDomain, topic);
  const collected: any[] = [];
  for (const q of queries) {
    const r = await youSearch(apiKey, q, 8);
    for (const w of (r?.results?.web ?? [])) {
      const d = domainOf(w.url);
      const isOfficial = d.endsWith(vendorDomain);
      const hint = OFFICIAL_HINTS.some(h => (w.title||'').toLowerCase().includes(h) || (w.description||'').toLowerCase().includes(h));
      let trust = 0;
      trust += isOfficial ? 50 : 0;
      trust += (w.url.endsWith('.pdf') ? 20 : 0);
      trust += hint ? 10 : 0;
      collected.push({
        url: w.url, title: w.title, domain: d, pageAge: w.page_age ? new Date(w.page_age) : undefined,
        trustScore: trust, snippet: (w.snippets||[]).join(' ')
      });
    }
  }
  // news ping for watcher utility
  const news = await youNews(apiKey, `${vendorDomain} ${topic}`, 30);
  return { web: rankByTrust(dedupe(collected)), news: news?.results?.items ?? [] };
}

function dedupe(arr: any[]) {
  const seen = new Set<string>();
  return arr.filter(x => {
    if (seen.has(x.url)) return false;
    seen.add(x.url); return true;
  });
}
