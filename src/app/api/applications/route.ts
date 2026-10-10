import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { applications } from "@/db/schema";
import { applicationSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = applicationSchema.safeParse({
      ...body,
      privacyAccepted: body.privacyAccepted === true || body.privacyAccepted === "on",
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Некоректні дані" },
        { status: 400 },
      );
    }

    // Honeypot — silent success for bots
    if (parsed.data.website) {
      return NextResponse.json({ ok: true });
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const ipHash = createHash("sha256").update(ip).digest("hex").slice(0, 64);

    await db.insert(applications).values({
      name: parsed.data.name,
      contact: parsed.data.contact,
      hasMilitaryExperience:
        parsed.data.hasMilitaryExperience === "yes"
          ? true
          : parsed.data.hasMilitaryExperience === "no"
            ? false
            : null,
      direction: parsed.data.direction || null,
      vacancyId: parsed.data.vacancyId || null,
      message: parsed.data.message || null,
      privacyAccepted: true,
      ipHash,
      userAgent: request.headers.get("user-agent")?.slice(0, 500) || null,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("application submit failed", error);
    return NextResponse.json(
      { error: "Серверна помилка. Спробуйте пізніше." },
      { status: 500 },
    );
  }
}
