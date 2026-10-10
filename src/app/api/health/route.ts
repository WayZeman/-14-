import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "14orb-website",
    db: Boolean(process.env.DATABASE_URL),
  });
}
