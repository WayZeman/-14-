"use client";

import { useEffect } from "react";
import { LinkButton } from "@/components/ui/link-button";
import { Container } from "@/components/ui/container";
import { DisplayTitle, Lead } from "@/components/ui/section";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="surface-paper flex min-h-[60vh] items-center pt-[var(--header-h)] pb-16">
      <Container narrow>
        <p className="text-meta text-[var(--muted)]">Помилка</p>
        <DisplayTitle as="h1" className="mt-3">
          Щось пішло не так
        </DisplayTitle>
        <Lead className="mt-4">
          Спробуйте оновити сторінку. Якщо проблема повторюється — зателефонуйте рекрутеру або
          залиште звернення пізніше.
        </Lead>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-12 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--accent)] px-6 text-sm font-semibold text-[var(--ink-inverse)]"
          >
            Спробувати знову
          </button>
          <LinkButton href="/" variant="outline">
            На головну
          </LinkButton>
        </div>
      </Container>
    </div>
  );
}
