import { NextRequest, NextResponse } from "next/server";
import { getDbClient } from "@/lib/getDbClient";

export async function GET(req: NextRequest) {
  const db = getDbClient(req.nextUrl.pathname);
  const identifications = await db.identification.findMany({
    orderBy: { ididentification: "asc" },
  });
  return NextResponse.json(identifications);
}

export async function POST(req: NextRequest) {
  const db = getDbClient(req.nextUrl.pathname);
  const { nameidentification } = await req.json();
  const identification = await db.identification.create({
    data: { nameidentification },
  });
  return NextResponse.json(identification);
}

export async function PUT(req: NextRequest) {
  const db = getDbClient(req.nextUrl.pathname);
  const { ididentification, nameidentification } = await req.json();
  const identification = await db.identification.update({
    where: { ididentification },
    data: { nameidentification },
  });
  return NextResponse.json(identification);
}

export async function DELETE(req: NextRequest) {
  const db = getDbClient(req.nextUrl.pathname);
  const { ididentification } = await req.json();
  await db.identification.delete({ where: { ididentification } });
  return NextResponse.json({ success: true });
}
