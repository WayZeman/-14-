import { NextResponse } from "next/server";
import { ne, desc } from "drizzle-orm";
import { db } from "@/db";
import { supportCampaigns } from "@/db/schema";

export const runtime = "nodejs";

export async function GET() {
  try {
    const campaigns = await db
      .select({
        id: supportCampaigns.id,
        title: supportCampaigns.title,
        description: supportCampaigns.description,
        monobankUrl: supportCampaigns.monobankUrl,
        cardNumber: supportCampaigns.cardNumber,
        status: supportCampaigns.status,
        goalAmount: supportCampaigns.goalAmount,
        raisedAmount: supportCampaigns.raisedAmount,
      })
      .from(supportCampaigns)
      .where(ne(supportCampaigns.status, "paused"))
      .orderBy(desc(supportCampaigns.createdAt));

    return NextResponse.json({ campaigns });
  } catch {
    return NextResponse.json({ campaigns: [] });
  }
}
