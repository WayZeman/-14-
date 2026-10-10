import Link from "next/link";
import { PageFrame, PageHeader, ContentPanel } from "@/components/layout/page-frame";
import { LinkButton } from "@/components/ui/link-button";

export default function NotFound() {
  return (
    <PageFrame>
      <PageHeader
        kicker="404"
        title="Сторінку не знайдено"
        lead="Перевірте адресу або поверніться на головну. Можливо, матеріал ще не опубліковано."
      />
      <ContentPanel>
        <div className="flex flex-col gap-3 sm:flex-row">
          <LinkButton href="/">На головну</LinkButton>
          <LinkButton href="/join" variant="outline">
            Звернення до рекрутера
          </LinkButton>
          <Link
            href="/contacts"
            className="inline-flex h-12 items-center justify-center text-sm font-semibold text-[var(--olive)] underline-offset-4 hover:underline"
          >
            Контакти
          </Link>
        </div>
      </ContentPanel>
    </PageFrame>
  );
}
