import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function GET() {
  const list = await prisma.watch.findMany({ where: { active: true }, orderBy: { createdAt: 'desc' }});
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  const { vendor, topic } = await req.json();
  const w = await prisma.watch.create({ data: { vendor, topic }});
  return NextResponse.json(w, { status: 201 });
}
