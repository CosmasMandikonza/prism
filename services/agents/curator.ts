import { youContents } from '../../packages/you-client';

export interface Curated {
  url: string; title?: string; content: string; docType?: string; lastModified?: Date; trustScore: number; hash: string;
}

import { createHash } from 'crypto';
function sha256(s: string) { return createHash('sha256').update(s).digest('hex'); }

export async function curate(apiKey: string, candidates: any[], limit = 2): Promise<Curated[]> {
  const top = candidates.slice(0, limit);
  const out: Curated[] = [];
  for (const c of top) {
    try {
      const r = await youContents(apiKey, c.url);
      const text = (r.content || '').trim().slice(0, 40000); // protect memory
      const docType = r.doc_type || (c.url.endsWith('.pdf') ? 'pdf' : 'html');
      const lm = r.last_modified ? new Date(r.last_modified) : undefined;
      out.push({
        url: c.url, title: r.title || c.title, content: text,
        docType, lastModified: lm, trustScore: c.trustScore + (lm ? 5 : 0), hash: sha256(text)
      });
    } catch { /* skip bad contents gracefully */ }
  }
  return out.sort((a,b)=>b.trustScore-a.trustScore);
}
