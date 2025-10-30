import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { verify } from '../../../../services/agents/verifier';

const prisma = new PrismaClient();

export async function POST() {
  const apiKey = process.env.YOU_API_KEY!;
  const watches = await prisma.watch.findMany({ where: { active: true }});
  for (const w of watches) {
    try {
      const v = await verify(apiKey, w.vendor, w.topic);
      await prisma.apiCall.create({ data: { endpoint: 'cron-verify', query: `${w.vendor}::${w.topic}`, selectedUrls: v.sources as any }});
      await prisma.watch.update({ where: { id: w.id }, data: { lastRun: new Date() }});
    } catch (e) {
      await prisma.apiCall.create({ data: { endpoint: 'cron-verify', query: `${w.vendor}::${w.topic}`, selectedUrls: [] }});
    }
  }
  return NextResponse.json({ ok: true });
}
