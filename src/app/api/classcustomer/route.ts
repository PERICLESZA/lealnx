import { NextRequest, NextResponse } from "next/server";
import { getDbClient } from "@/lib/getDbClient";

export async function GET(req: NextRequest) {
  const db = getDbClient(req.nextUrl.pathname);
  const classes = await db.classcustomer.findMany({
    orderBy: { idclasscustomer: "asc" },
  });
  return NextResponse.json(classes);
}

export async function POST(req: NextRequest) {
  const db = getDbClient(req.nextUrl.pathname);
  const { description, seeincompany } = await req.json();
  const newClass = await db.classcustomer.create({
    data: { description, seeincompany },
  });
  return NextResponse.json(newClass);
}

export async function PUT(req: NextRequest) {
  const db = getDbClient(req.nextUrl.pathname);
  const { idclasscustomer, description, seeincompany } = await req.json();
  const updated = await db.classcustomer.update({
    where: { idclasscustomer },
    data: { description, seeincompany },
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const db = getDbClient(req.nextUrl.pathname);
  const { idclasscustomer } = await req.json();
  await db.classcustomer.delete({ where: { idclasscustomer } });
  return NextResponse.json({ success: true });
}
