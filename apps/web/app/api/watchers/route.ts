import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const list = await prisma.watch.findMany({ where: { active: true }, orderBy: { createdAt: "desc" }});
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  const { vendor, topic } = await req.json();
  if (!vendor || !topic) return NextResponse.json({ error: "vendor & topic required" }, { status: 400 });
  const w = await prisma.watch.create({ data: { vendor, topic }});
  return NextResponse.json(w, { status: 201 });
}
