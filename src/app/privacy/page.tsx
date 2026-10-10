import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { PageFrame, PageHeader, ContentPanel } from "@/components/layout/page-frame";

export const metadata: Metadata = {
  title: "Політика конфіденційності",
  description: "Як 14 ОРБ обробляє персональні дані кандидатів і відвідувачів сайту.",
};

export default function PrivacyPage() {
  return (
    <PageFrame>
      <PageHeader kicker="Юридична інформація" title="Політика конфіденційності" />
      <ContentPanel>
        <div className="prose-orb space-y-6 text-sm md:text-base">
          <p>
            Ця політика пояснює, які дані збирає офіційний сайт {siteConfig.fullName}{" "}
            ({siteConfig.url}) і з якою метою.
          </p>
          <h2 className="font-display text-lg font-semibold text-[var(--graphite)]">
            Які дані ми збираємо
          </h2>
          <p>
            Через форму звернення кандидата: ім&apos;я, контактний телефон або інший
            спосіб зв&apos;язку, за бажанням — наявність військового досвіду, цікавий
            напрям і коротке повідомлення. Також технічні дані запиту (хеш IP,
            user-agent) для захисту від спаму.
          </p>
          <h2 className="font-display text-lg font-semibold text-[var(--graphite)]">
            Мета обробки
          </h2>
          <p>
            Зв&apos;язок рекрутера з кандидатом щодо можливості служби в підрозділі.
            Дані не використовуються для маркетингових розсилок.
          </p>
          <h2 className="font-display text-lg font-semibold text-[var(--graphite)]">
            Доступ і зберігання
          </h2>
          <p>
            Звернення доступні лише уповноваженим користувачам адмінпанелі (ролі admin /
            recruiter). Секрети та паролі зберігаються у змінних середовища, не в
            клієнтському коді.
          </p>
          <h2 className="font-display text-lg font-semibold text-[var(--graphite)]">
            Чого ми не просимо через публічну форму
          </h2>
          <p>
            Документи, точне місце перебування, військову частину, поточні завдання та
            інші чутливі відомості. Такі дані передаються лише за окремим погодженим
            процесом з рекрутером.
          </p>
          <p>
            Контакт:{" "}
            <a href={`tel:${siteConfig.phone}`} className="underline">
              {siteConfig.phoneDisplay}
            </a>
            .
          </p>
        </div>
      </ContentPanel>
    </PageFrame>
  );
}
