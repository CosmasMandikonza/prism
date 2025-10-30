import { NextRequest, NextResponse } from 'next/server';
import { plan } from '../../../../services/agents/planner';
import { verify } from '../../../../services/agents/verifier';
import { present } from '../../../../services/agents/presenter';
import { PrismaClient } from '@prisma/client';
import { youSearch } from '../../../../packages/you-client';
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { claim, vendorDomain, internalText } = await req.json();
  const apiKey = process.env.YOU_API_KEY!;
  if (!apiKey) return NextResponse.json({ error: 'missing api key' }, { status: 500 });

  // Trace and API-call proof logging
  const traceSteps: any[] = [];
  const start = Date.now();

  const { subclaims } = plan(claim);
  traceSteps.push({ step: 'plan', subclaims });

  const v = await verify(apiKey, vendorDomain, claim || vendorDomain);
  traceSteps.push({ step: 'verify', summary: { decision: v.decision, confidence: v.confidence, sources: v.sources } });

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

  return NextResponse.json({ ...answer, traceId: trace.id, resultId: result.id }, { status: 200 });
}

function summarize(text: string) {
  // quick heuristic: first 2 sentences
  const s = text.split(/(?<=[.!?])\s/).slice(0,2).join(' ');
  return s || text.slice(0, 320);
}
