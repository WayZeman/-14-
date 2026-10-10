"use client";

import { motion, useReducedMotion } from "framer-motion";
import { siteCopy } from "@/content/site-copy";
import { siteConfig } from "@/lib/site-config";
import { siteImages } from "@/content/image-catalog";
import { Container } from "@/components/ui/container";
import { TextReveal } from "@/components/ui/text-reveal";
import { LinkButton } from "@/components/ui/link-button";
import { ThemedImage } from "@/components/ui/themed-image";

export function Hero({
  headline: headlineProp,
  sub,
}: {
  headline?: string;
  sub?: string;
} = {}) {
  const reduce = useReducedMotion();
  const img = siteImages.homeHero;

  const headline =
    headlineProp ||
    (siteConfig.useExperimentalHeadline
      ? siteConfig.heroHeadline
      : siteConfig.heroHeadlineFallback);

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[var(--graphite)] text-white">
      <ThemedImage
        src={img.src}
        alt={img.alt}
        priority
        quality={92}
        filmGrain={false}
        grade="graphite"
        className="absolute inset-0"
        imageClassName="object-cover object-[center_42%] sm:object-[center_38%]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[var(--graphite)]/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--graphite)] via-[var(--graphite)]/50 to-[var(--graphite)]/15" />
      <div className="absolute inset-0 max-w-[55%] bg-gradient-to-r from-[var(--graphite)]/90 via-[var(--graphite)]/55 to-transparent" />

      <Container className="relative z-[3] flex min-h-[100svh] flex-col justify-end pb-14 pt-28 md:max-w-[var(--container-max)] md:justify-center md:pb-20 md:pt-32">
        <div className="max-w-2xl md:max-w-3xl">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-meta mb-6 text-white/55"
          >
            {siteConfig.name} · {siteConfig.fullName}
          </motion.p>

          <h1 className="font-editorial text-[clamp(2.85rem,9vw,5.25rem)] leading-[0.95] tracking-[-0.03em] text-white">
            <span className="sr-only">
              {siteConfig.name} — {siteConfig.fullName}.{" "}
            </span>
            <TextReveal as="span" text={headline} delay={0.08} />
          </h1>

          {sub ? (
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.45 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg"
            >
              {sub}
            </motion.p>
          ) : null}

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <LinkButton href="/join" variant="primary" size="lg">
              {siteCopy.hero.ctaJoin}
            </LinkButton>
            <LinkButton
              href="/#about"
              variant="secondary"
              size="lg"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("about")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
                history.replaceState(null, "", "/");
              }}
            >
              {siteCopy.hero.ctaAbout}
            </LinkButton>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
