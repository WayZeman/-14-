import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import {
  PageFrame,
  PageHeader,
  ContentPanel,
  PageCard,
} from "@/components/layout/page-frame";
import { LinkButton } from "@/components/ui/link-button";

export const metadata: Metadata = {
  title: "Як подати заявку",
  description:
    "Відеогайд: як подати звернення до рекрутера 14 ОРБ через офіційний сайт.",
};

const steps = [
  "Відкрийте сайт 14orb.co.ua",
  "Натисніть «Приєднатися»",
  "Знайдіть форму звернення",
  "Вкажіть ім'я та телефон",
  "За бажанням додайте напрям і повідомлення",
  "Підтвердіть політику конфіденційності",
  "Натисніть «Надіслати звернення»",
] as const;

export default function ApplyGuidePage() {
  return (
    <PageFrame>
      <PageHeader
        kicker="Гайд"
        title="Як подати заявку через сайт"
        lead="Коротке відео: шлях від головної сторінки до відправки форми рекрутеру."
      />
      <ContentPanel width="narrow">
        <div className="overflow-hidden border border-[var(--line)] bg-black shadow-[0_30px_80px_-40px_rgba(0,0,0,0.65)]">
          <video
            className="aspect-video w-full"
            controls
            playsInline
            preload="metadata"
            poster="/images/sections/hero-home.jpg"
          >
            <source src="/media/yak-podaty-zayavku.webm" type="video/webm" />
            Ваш браузер не відтворює відео.{" "}
            <a href="/media/yak-podaty-zayavku.webm" className="underline">
              Завантажити файл
            </a>
            .
          </video>
        </div>
        <p className="mt-3 text-xs text-[var(--muted)]">
          Знято в стилі{" "}
          <a
            href="https://github.com/DougNix/recordly"
            className="underline underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            Recordly
          </a>
          : soft-zoom, студійна рамка, курсорні анімації.
        </p>

        <PageCard className="mt-8" tone="soft">
          <h2 className="font-display text-lg font-semibold text-[var(--graphite)]">
            Кроки з відео
          </h2>
          <ol className="mt-4 space-y-3">
            {steps.map((step, i) => (
              <li key={step} className="flex gap-3 text-sm text-[var(--ink-soft)] md:text-base">
                <span className="font-mono text-[var(--olive)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-sm text-[var(--muted)]">
            Не надсилайте через форму документи чи службові деталі. Уточнення — у розмові з
            рекрутером ({siteConfig.workingHours}).
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="/join#form">Перейти до форми</LinkButton>
            <LinkButton href={`tel:${siteConfig.phone}`} variant="outline">
              Зателефонувати
            </LinkButton>
          </div>
        </PageCard>
      </ContentPanel>
    </PageFrame>
  );
}
