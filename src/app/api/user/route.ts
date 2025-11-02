import { NextRequest, NextResponse } from "next/server";
import { getDbClient } from "@/lib/getDbClient";

export async function GET(req: NextRequest) {
  const db = getDbClient(req.nextUrl.pathname);
  const logins = await db.login.findMany({
    orderBy: { idlogin: "asc" },
  });
  return NextResponse.json(logins);
}

export async function POST(req: NextRequest) {
  const db = getDbClient(req.nextUrl.pathname);
  const data = await req.json();
  const login = await db.login.create({ data });
  return NextResponse.json(login);
}

export async function PUT(req: NextRequest) {
  const db = getDbClient(req.nextUrl.pathname);
  const data = await req.json();
  const { idlogin, ...rest } = data;
  const login = await db.login.update({
    where: { idlogin },
    data: rest,
  });
  return NextResponse.json(login);
}

export async function DELETE(req: NextRequest) {
  const db = getDbClient(req.nextUrl.pathname);
  const { idlogin } = await req.json();
  await db.login.delete({ where: { idlogin } });
  return NextResponse.json({ success: true });
}
