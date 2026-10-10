"use client";

import { useEffect, useState } from "react";
import { siteCopy } from "@/content/site-copy";
import { siteConfig } from "@/lib/site-config";
import {
  PageFrame,
  PageHeader,
  ContentPanel,
  PageGrid,
  PageCentered,
} from "@/components/layout/page-frame";
import { SupportCampaignCard } from "@/components/support/support-campaign-card";

type Campaign = {
  id: string;
  title: string;
  description: string | null;
  monobankUrl: string | null;
  cardNumber: string | null;
  status: string;
  goalAmount: number | null;
  raisedAmount: number | null;
};

export default function SupportPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/campaigns")
      .then((r) => r.json())
      .then((d) => setCampaigns(d.campaigns || []))
      .catch(() => setCampaigns([]));
  }, []);

  async function copyCard(id: string, number: string) {
    try {
      await navigator.clipboard.writeText(number.replace(/\s/g, ""));
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      /* ignore */
    }
  }

  const fallbackCard = siteConfig.cardNumber;
  const fallbackMono = siteConfig.monobankUrl;

  const list =
    campaigns.length > 0
      ? campaigns
      : [
          {
            id: "fallback",
            title: siteCopy.supportPage.fallbackTitle,
            description: siteCopy.supportPage.fallbackDescription,
            monobankUrl: fallbackMono,
            cardNumber: fallbackCard,
            status: "active",
            goalAmount: null,
            raisedAmount: null,
          },
        ];

  return (
    <PageFrame>
      <PageHeader
        kicker="Підтримка"
        title={siteCopy.supportPage.title}
        lead={siteCopy.supportPage.intro}
      />
      <ContentPanel>
        {list.length === 1 ? (
          <PageCentered maxWidth="lg">
            <SupportCampaignCard
              key={list[0].id}
              title={list[0].title}
              description={list[0].description}
              monobankUrl={list[0].monobankUrl}
              cardNumber={list[0].cardNumber}
              status={list[0].status}
              goalAmount={list[0].goalAmount}
              raisedAmount={list[0].raisedAmount}
              copied={copiedId === list[0].id}
              onCopyCard={(number) => copyCard(list[0].id, number)}
            />
          </PageCentered>
        ) : (
          <PageGrid columns={2}>
            {list.map((c) => (
              <SupportCampaignCard
                key={c.id}
                title={c.title}
                description={c.description}
                monobankUrl={c.monobankUrl}
                cardNumber={c.cardNumber}
                status={c.status}
                goalAmount={c.goalAmount}
                raisedAmount={c.raisedAmount}
                copied={copiedId === c.id}
                onCopyCard={(number) => copyCard(c.id, number)}
              />
            ))}
          </PageGrid>
        )}
      </ContentPanel>
    </PageFrame>
  );
}
