import { siteCopy } from "@/content/site-copy";
import { siteImages } from "@/content/image-catalog";
import { Container } from "@/components/ui/container";
import { Section, Kicker, DisplayTitle, Lead } from "@/components/ui/section";
import { Reveal } from "@/components/shared/reveal";
import { LinkButton } from "@/components/ui/link-button";
import { SectionBackdrop } from "@/components/ui/themed-image";

export function JoinStepsSection() {
  return (
    <Section id="how-to-join" tone="olive" className="relative overflow-hidden">
      <SectionBackdrop src={siteImages.illustrative.recruitingPath.src} opacity={0.28} />
      <div className="absolute inset-0 bg-[var(--olive-deep)]/88" aria-hidden />

      <Container className="relative">
        <Reveal>
          <Kicker index="04" dark>
            Як долучитися
          </Kicker>
          <DisplayTitle dark>{siteCopy.joinSteps.title}</DisplayTitle>
          <Lead dark className="mt-5">
            {siteCopy.joinSteps.intro}
          </Lead>
        </Reveal>

        <ol className="mt-12 grid gap-0 md:grid-cols-5 md:gap-3">
          {siteCopy.joinSteps.steps.map((step, i) => (
            <li
              key={step}
              className="border-l border-white/20 py-4 pl-6 md:border-l-0 md:border-t md:py-0 md:pl-0 md:pt-8"
            >
              <Reveal delay={0.05 * i}>
                <span className="font-mono text-sm text-[var(--accent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-3 text-sm leading-relaxed text-white/88 md:pr-2">{step}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal delay={0.15} className="mt-12 flex justify-center">
          <LinkButton href="/join#form" variant="primary">
            {siteCopy.joinSteps.cta}
          </LinkButton>
        </Reveal>
      </Container>
    </Section>
  );
}
