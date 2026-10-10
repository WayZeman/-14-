import { siteCopy } from "@/content/site-copy";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui/container";
import { Section, DisplayTitle, Lead } from "@/components/ui/section";
import { Reveal } from "@/components/shared/reveal";
import { LinkButton } from "@/components/ui/link-button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FinalCta() {
  return (
    <Section tone="paper" className="!pb-20">
      <Container>
        <Reveal>
          <div className="border border-[var(--line)] bg-white px-6 py-10 md:px-12 md:py-14">
            <p className="text-meta text-[var(--muted)]">{siteCopy.finalCta.label}</p>
            <DisplayTitle as="h2" className="mt-3 max-w-2xl text-[clamp(1.75rem,3.5vw,2.75rem)]">
              {siteCopy.finalCta.title}
            </DisplayTitle>
            <Lead className="mt-4">{siteCopy.finalCta.body}</Lead>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={`tel:${siteConfig.phone}`}
                className={cn(buttonVariants({ variant: "dark", size: "default" }))}
              >
                {siteCopy.finalCta.ctaPhone}
              </a>
              <LinkButton href="/join#form">{siteCopy.finalCta.ctaForm}</LinkButton>
              <LinkButton href="/contacts" variant="outline">
                {siteCopy.finalCta.ctaContacts}
              </LinkButton>
            </div>
            <p className="mt-5 text-sm text-[var(--muted)]">{siteConfig.workingHours}</p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
