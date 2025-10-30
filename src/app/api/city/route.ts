import { NextRequest, NextResponse } from "next/server";
import { getDbClient } from "@/lib/getDbClient";

export async function GET(req: NextRequest) {
  const db = getDbClient(req.nextUrl.pathname);
  const cities = await db.city.findMany({ orderBy: { idcity: "asc" } });
  return NextResponse.json(cities);
}

export async function POST(req: NextRequest) {
  const db = getDbClient(req.nextUrl.pathname);
  const { name_city } = await req.json();
  const city = await db.city.create({ data: { name_city } });
  return NextResponse.json(city);
}

export async function PUT(req: NextRequest) {
  const db = getDbClient(req.nextUrl.pathname);
  const { idcity, name_city } = await req.json();
  const city = await db.city.update({
    where: { idcity },
    data: { name_city },
  });
  return NextResponse.json(city);
}

export async function DELETE(req: NextRequest) {
  const db = getDbClient(req.nextUrl.pathname);
  const { idcity } = await req.json();
  await db.city.delete({ where: { idcity } });
  return NextResponse.json({ success: true });
}
