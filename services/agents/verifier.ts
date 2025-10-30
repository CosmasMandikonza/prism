import { retrieve } from './retriever';
import { curate } from './curator';

export interface VerifyResult {
  decision: 'Cite'|'Abstain';
  confidence: 'Low'|'Medium'|'High';
  bestText?: string;
  sources: { url: string; title?: string; trustScore: number }[];
  rationale: string;
}

function computeConfidence(sources: any[]) {
  const s = Math.max(...sources.map(x=>x.trustScore ?? 0), 0);
  if (s >= 70) return 'High';
  if (s >= 40) return 'Medium';
  return 'Low';
}

export async function verify(apiKey: string, vendorDomain: string, topic: string): Promise<VerifyResult> {
  const r = await retrieve(apiKey, vendorDomain, topic);
  const curated = await curate(apiKey, r.web, 2);

  if (curated.length === 0) {
    return { decision: 'Abstain', confidence: 'Low', sources: [], rationale: 'No authoritative sources available.' };
  }

  // Simple conflict check: if top2 hashes differ substantially, lower confidence.
  const conflict = curated.length === 2 && curated[0].hash.slice(0,8) !== curated[1].hash.slice(0,8);

  const confidence = computeConfidence(curated) as VerifyResult['confidence'];
  return {
    decision: 'Cite',
    confidence: conflict ? (confidence === 'High' ? 'Medium' : 'Low') : confidence,
    bestText: curated[0].content.slice(0, 4000),
    sources: curated.map(c=>({ url: c.url, title: c.title, trustScore: c.trustScore })),
    rationale: conflict ? 'Conflicting sources detected; confidence reduced.' : 'Top source(s) consistent.'
  };
}
