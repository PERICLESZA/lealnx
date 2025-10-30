import { NextRequest, NextResponse } from "next/server";
import { getDbClient } from "@/lib/getDbClient";

export async function GET(req: NextRequest) {
  const db = getDbClient(req.nextUrl.pathname);
  const banks = await db.bank.findMany({
    orderBy: { idbank: "asc" },
  });
  return NextResponse.json(banks);
}

export async function POST(req: NextRequest) {
  const db = getDbClient(req.nextUrl.pathname);
  const { namebank, agency, count } = await req.json();
  const bank = await db.bank.create({
    data: { namebank, agency, count },
  });
  return NextResponse.json(bank);
}

export async function PUT(req: NextRequest) {
  const db = getDbClient(req.nextUrl.pathname);
  const { idbank, namebank, agency, count } = await req.json();
  const bank = await db.bank.update({
    where: { idbank },
    data: { namebank, agency, count },
  });
  return NextResponse.json(bank);
}

export async function DELETE(req: NextRequest) {
  const db = getDbClient(req.nextUrl.pathname);
  const { idbank } = await req.json();
  await db.bank.delete({ where: { idbank } });
  return NextResponse.json({ success: true });
}
