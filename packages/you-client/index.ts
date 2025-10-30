import type { SearchResponse, ContentsResponse, NewsResponse } from './types';

const BASE = 'https://api.you.com';

function headers(apiKey: string) {
  return {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };
}

// NOTE: Workaround from Discord: prefer `/search` over `/v1/search` if freshness bug hits.
export async function youSearch(apiKey: string, q: string, size = 8) : Promise<SearchResponse> {
  const candidates = [`/search`, `/v1/search`]; // try in this order
  let lastErr: any;
  for (const path of candidates) {
    try {
      const res = await fetch(`${BASE}${path}`, {
        method: 'POST',
        headers: headers(apiKey),
        body: JSON.stringify({ q, size })
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return await res.json() as SearchResponse;
    } catch (e) { lastErr = e; }
  }
  throw lastErr;
}

export async function youContents(apiKey: string, url: string) : Promise<ContentsResponse> {
  const res = await fetch(`${BASE}/v1/contents`, {
    method: 'POST',
    headers: headers(apiKey),
    body: JSON.stringify({ url })
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return await res.json() as ContentsResponse;
}

export async function youNews(apiKey: string, q: string, sinceDays = 30) : Promise<NewsResponse> {
  const res = await fetch(`${BASE}/v1/livenews`, {
    method: 'POST',
    headers: headers(apiKey),
    body: JSON.stringify({ q, since_days: sinceDays })
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return await res.json() as NewsResponse;
}
