import Link from "next/link";
import { siteCopy } from "@/content/site-copy";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui/container";
import { Section, Kicker, DisplayTitle, Lead } from "@/components/ui/section";
import { Reveal } from "@/components/shared/reveal";
import { LinkButton } from "@/components/ui/link-button";

export function RecruitingSection({
  vacancies,
}: {
  vacancies: {
    id: string;
    title: string;
    slug: string;
    shortDescription: string | null;
    direction: string | null;
  }[];
}) {
  return (
    <Section id="recruiting" tone="paper">
      <Container>
        <div className="max-w-3xl">
          <Reveal>
            <Kicker index="03">Рекрутинг</Kicker>
            <DisplayTitle>{siteCopy.homeRecruiting.title}</DisplayTitle>
            <Lead className="mt-5">{siteCopy.homeRecruiting.intro}</Lead>
          </Reveal>

          <Reveal delay={0.06} className="mt-10">
            <p className="text-meta text-[var(--muted)]">
              {siteCopy.homeRecruiting.requirementsLabel}
            </p>
            <p className="mt-3 text-base leading-relaxed text-[var(--ink-soft)]">
              {siteConfig.requirementsOfficial}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/vacancies">{siteCopy.homeRecruiting.ctaVacancies}</LinkButton>
            <LinkButton href="/join#form" variant="outline">
              {siteCopy.homeRecruiting.ctaContact}
            </LinkButton>
          </Reveal>
        </div>

        <div className="mt-14">
          {vacancies.length === 0 ? (
            <Reveal>
              <p className="max-w-xl border-t border-[var(--line)] pt-8 text-[var(--ink-soft)]">
                {siteCopy.homeRecruiting.emptyVacancies}
              </p>
            </Reveal>
          ) : (
            <ol className="border-t border-[var(--line)]">
              {vacancies.slice(0, 4).map((v, i) => (
                <Reveal key={v.id} delay={0.03 * i}>
                  <li className="border-b border-[var(--line)]">
                    <Link
                      href={`/vacancies/${v.slug}`}
                      className="group flex items-baseline justify-between gap-6 py-5 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <span className="font-mono text-xs text-[var(--muted)]">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          {v.direction ? (
                            <span className="text-meta text-[var(--muted)]">{v.direction}</span>
                          ) : null}
                        </div>
                        <h3 className="mt-1 font-display text-xl font-semibold text-[var(--graphite)] group-hover:text-[var(--olive-ink)]">
                          {v.title}
                        </h3>
                        {v.shortDescription ? (
                          <p className="mt-1 max-w-2xl text-sm text-[var(--ink-soft)]">
                            {v.shortDescription}
                          </p>
                        ) : null}
                      </div>
                      <span
                        aria-hidden
                        className="shrink-0 font-mono text-sm text-[var(--olive)] transition-transform group-hover:translate-x-0.5"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                </Reveal>
              ))}
            </ol>
          )}
        </div>
      </Container>
    </Section>
  );
}
