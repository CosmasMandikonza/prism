import { NextRequest, NextResponse } from 'next/server';
import { plan } from '../../../../services/agents/planner';
import { verify } from '../../../../services/agents/verifier';
import { present } from '../../../../services/agents/presenter';
import { prisma } from '@/app/lib/prisma';

export async function POST(req: NextRequest) {
  const { claim, vendorDomain, internalText } = await req.json();
  const apiKey = process.env.YOU_API_KEY!;
  if (!apiKey) return NextResponse.json({ error: 'missing api key' }, { status: 500 });

  const traceSteps: any[] = [];
  const { subclaims } = plan(claim);
  traceSteps.push({ step: 'plan', subclaims });

  const started = Date.now();
  const v = await verify(apiKey, vendorDomain, claim || vendorDomain);
  const latency = Date.now() - started;
  traceSteps.push({ step: 'verify', summary: { decision: v.decision, confidence: v.confidence, sources: v.sources }, latency });

  const p = present(internalText || '', v.bestText || '');
  traceSteps.push({ step: 'present', diffLen: p.diff.length });

  const answer = {
    answer: v.bestText ? summarize(v.bestText) : 'No sufficient evidence found.',
    decision: v.decision,
    confidence: v.confidence,
    sources: v.sources,
    diff: p.diff
  };

  const trace = await prisma.trace.create({ data: { steps: traceSteps as any }});
  const result = await prisma.result.create({ data: {
    answer: answer.answer,
    confidence: answer.confidence,
    decision: answer.decision,
    internalText: internalText || '',
    externalText: v.bestText || '',
    diffJson: answer.diff as any
  }});

  await prisma.query.create({ data: {
    userQuestion: claim,
    normalized: `${vendorDomain}::${claim}`,
    resultId: result.id,
    traceId: trace.id
  }});

  // record an ApiCall row (for auditor-proof)
  await prisma.apiCall.create({ data: {
    endpoint: 'ask-verify',
    query: `${vendorDomain}::${claim}`,
    latencyMs: latency,
    selectedUrls: v.sources as any
  }});

  return NextResponse.json({ ...answer, traceId: trace.id, resultId: result.id, traceSteps }, { status: 200 });
}

function summarize(text: string) {
  const s = text.split(/(?<=[.!?])\s/).slice(0,2).join(' ');
  return s || text.slice(0, 320);
}

