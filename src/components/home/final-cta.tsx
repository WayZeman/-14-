import { siteCopy } from "@/content/site-copy";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui/container";
import { Section, DisplayTitle, Lead } from "@/components/ui/section";
import { Reveal } from "@/components/shared/reveal";
import { LinkButton } from "@/components/ui/link-button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FinalCta({
  phone = siteConfig.phone,
  workingHours = siteConfig.workingHours,
}: {
  phone?: string;
  workingHours?: string;
} = {}) {
  return (
    <Section tone="paper" className="!pb-20">
      <Container>
        <Reveal>
          <div className="border border-[var(--line)] bg-white px-5 py-10 sm:px-6 md:px-12 md:py-14">
            <p className="text-meta text-[var(--muted)]">{siteCopy.finalCta.label}</p>
            <DisplayTitle as="h2" className="mt-3 max-w-2xl text-[clamp(1.75rem,3.5vw,2.75rem)]">
              {siteCopy.finalCta.title}
            </DisplayTitle>
            <Lead className="mt-4">{siteCopy.finalCta.body}</Lead>
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <a
                href={`tel:${phone}`}
                className={cn(
                  buttonVariants({ variant: "dark", size: "default" }),
                  "w-full !text-white sm:w-auto",
                )}
              >
                {siteCopy.finalCta.ctaPhone}
              </a>
              <LinkButton href="/join#form" className="w-full sm:w-auto">
                {siteCopy.finalCta.ctaForm}
              </LinkButton>
              <LinkButton href="/contacts" variant="outline" className="w-full sm:w-auto">
                {siteCopy.finalCta.ctaContacts}
              </LinkButton>
            </div>
            <p className="mt-5 text-center text-sm text-[var(--muted)] sm:text-left">
              {workingHours}
            </p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
