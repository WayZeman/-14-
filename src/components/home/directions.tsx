import { siteCopy } from "@/content/site-copy";
import { siteImages } from "@/content/image-catalog";
import { Container } from "@/components/ui/container";
import { Section, Kicker, DisplayTitle, Lead } from "@/components/ui/section";
import { Reveal } from "@/components/shared/reveal";
import { LinkButton } from "@/components/ui/link-button";
import { SectionBackdrop } from "@/components/ui/themed-image";

export function DirectionsSection() {
  return (
    <Section id="directions" tone="ink" className="relative overflow-hidden">
      <SectionBackdrop src={siteImages.illustrative.directionsField.src} opacity={0.35} />

      <Container className="relative">
        <div className="editorial-grid">
          <Reveal className="lg:col-span-4 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
            <Kicker index="02" dark>
              Напрямки
            </Kicker>
            <DisplayTitle dark>{siteCopy.directions.title}</DisplayTitle>
            <Lead dark className="mt-5">
              {siteCopy.directions.intro}
            </Lead>
            <LinkButton href="/vacancies" variant="outlineOnDark" className="mt-8 hidden lg:inline-flex">
              {siteCopy.directions.cta}
            </LinkButton>
          </Reveal>

          <ol className="lg:col-span-8 lg:col-start-6">
            {siteCopy.directions.items.map((item, i) => (
              <li
                key={item.title}
                className="border-t border-[var(--line-on-dark)] bg-[var(--graphite)]/40 px-5 py-7 backdrop-blur-[2px] sm:px-6 md:px-8 md:py-8"
              >
                <Reveal delay={0.04 * i}>
                  <div className="grid gap-3 md:grid-cols-[4rem_1fr] md:gap-6">
                    <span className="font-mono text-sm text-[var(--accent)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-semibold text-white md:text-xl">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/65 md:text-base">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        <LinkButton href="/vacancies" variant="outlineOnDark" className="mt-10 lg:hidden">
          {siteCopy.directions.cta}
        </LinkButton>
      </Container>
    </Section>
  );
}
