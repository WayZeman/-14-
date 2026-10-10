import { siteImages } from "@/content/image-catalog";
import { Container } from "@/components/ui/container";
import { Section, Kicker, DisplayTitle } from "@/components/ui/section";
import { Reveal } from "@/components/shared/reveal";
import { ThemedImage } from "@/components/ui/themed-image";
import type { HomeAboutSettings } from "@/lib/cms-types";

export function AboutSection({ content }: { content: HomeAboutSettings }) {
  const img = siteImages.illustrative.teamCoordination;

  return (
    <Section id="about" tone="paper">
      <Container>
        <div className="editorial-grid items-start">
          <Reveal className="lg:col-span-5">
            <div className="relative aspect-[4/5] lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
              <ThemedImage
                src={img.src}
                alt={img.alt}
                sizes="(max-width: 1024px) 100vw, 38vw"
                grade="olive"
                className="absolute inset-0"
              />
            </div>
          </Reveal>

          <div className="lg:col-span-7 lg:pl-4 xl:pl-8">
            <Reveal>
              <Kicker index="01">Хто ми</Kicker>
              <DisplayTitle>{content.title}</DisplayTitle>
            </Reveal>

            <Reveal delay={0.06} className="mt-8">
              <blockquote className="border-l-2 border-[var(--accent)] pl-5 font-editorial text-xl leading-snug text-[var(--graphite)] md:text-2xl">
                {content.quote}
              </blockquote>
            </Reveal>

            <Reveal delay={0.1} className="mt-8 space-y-5 text-base leading-relaxed text-[var(--ink-soft)] md:text-lg">
              <p>{content.paragraph2}</p>
              <p>{content.paragraph3}</p>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
