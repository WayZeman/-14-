import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { getContactsSettings, getSitePage, pageDefaults } from "@/lib/cms";
import { PageFrame, PageHeader, ContentPanel } from "@/components/layout/page-frame";

export const metadata: Metadata = {
  title: "Політика конфіденційності",
  description: "Як 14 ОРБ обробляє персональні дані кандидатів і відвідувачів сайту.",
};

export const dynamic = "force-dynamic";

const FALLBACK_PRIVACY = `Ця політика пояснює, які дані збирає офіційний сайт ${siteConfig.fullName} (${siteConfig.url}) і з якою метою.

Які дані ми збираємо
Через форму звернення кандидата: ім'я, контактний телефон або інший спосіб зв'язку, за бажанням — наявність військового досвіду, цікавий напрям і коротке повідомлення. Також технічні дані запиту (хеш IP, user-agent) для захисту від спаму.

Мета обробки
Зв'язок рекрутера з кандидатом щодо можливості служби в підрозділі. Дані не використовуються для маркетингових розсилок.

Доступ і зберігання
Звернення доступні лише уповноваженим користувачам адмінпанелі (ролі admin / recruiter). Секрети та паролі зберігаються у змінних середовища, не в клієнтському коді.

Чого ми не просимо через публічну форму
Документи, точне місце перебування, військову частину, поточні завдання та інші чутливі відомості. Такі дані передаються лише за окремим погодженим процесом з рекрутером.`;

export default async function PrivacyPage() {
  const [page, contacts] = await Promise.all([getSitePage("privacy"), getContactsSettings()]);
  const defaults = pageDefaults("privacy");
  const title = page?.title ?? defaults.title;
  const body = page?.body && page.body !== defaults.body ? page.body : FALLBACK_PRIVACY;

  return (
    <PageFrame>
      <PageHeader kicker="Юридична інформація" title={title} />
      <ContentPanel width="narrow">
        <div className="prose-orb whitespace-pre-line text-sm md:text-base">{body}</div>
        <p className="mt-8 text-sm md:text-base">
          Контакт:{" "}
          <a href={`tel:${contacts.phone}`} className="font-semibold text-[var(--graphite)] underline">
            {contacts.phoneDisplay}
          </a>
          .
        </p>
      </ContentPanel>
    </PageFrame>
  );
}
