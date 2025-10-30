import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { buildEvidencePDF } from '../../../lib/pdf';
import { sha256 } from '../../../lib/crypto';
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { resultId } = await req.json();
  const result = await prisma.result.findUnique({ where: { id: resultId }});
  if (!result) return NextResponse.json({ error: 'Result not found' }, { status: 404 });

  // For demo, sources are attached through Result->Sources in a full build.
  const sources = await prisma.source.findMany({ where: { resultId }});

  const jsonBlob = {
    resultId,
    decision: result.decision,
    confidence: result.confidence,
    sources: sources.map(s=>({ url: s.url, title: s.title, hash: s.contentHash })),
    timestamps: { generatedAt: new Date().toISOString() }
  };

  const pdf = buildEvidencePDF({
    answer: result.answer,
    decision: result.decision,
    confidence: result.confidence,
    sources: sources.map(s=>({ url: s.url, title: s.title, hash: s.contentHash })),
    timestamps: jsonBlob.timestamps,
    youRequests: [] // could hydrate from ApiCall table
  });

  const pack = await prisma.evidencePack.create({
    data: { jsonBlob, sha256: sha256(JSON.stringify(jsonBlob)) }
  });

  // Stream PDF to client, optionally upload to object store (S3) and set pdfUrl in DB
  return new NextResponse(pdf, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="prism-evidence-${resultId}.pdf"`
    }
  });
}
