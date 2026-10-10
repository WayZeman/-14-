"use client";

import { useState } from "react";
import { siteCopy } from "@/content/site-copy";
import { siteConfig } from "@/lib/site-config";

export function ApplicationForm({
  directions = [],
}: {
  directions?: string[];
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          contact: data.get("contact"),
          hasMilitaryExperience: data.get("hasMilitaryExperience") || undefined,
          direction: data.get("direction") || undefined,
          message: data.get("message") || undefined,
          privacyAccepted: data.get("privacyAccepted") === "on",
          website: data.get("website") || "",
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setStatus("error");
        setError(json.error || "Не вдалося надіслати звернення");
        return;
      }

      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
      setError(siteCopy.form.errorNetwork);
    }
  }

  return (
    <form
      id="form"
      onSubmit={onSubmit}
      className="relative space-y-5 border border-[var(--line)] bg-white p-6 md:p-8"
    >
      <div>
        <label htmlFor="name" className="text-sm font-medium text-[var(--graphite)]">
          Ім&apos;я *
        </label>
        <input
          id="name"
          name="name"
          required
          autoComplete="name"
          className="mt-2 w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-sm outline-none focus:border-[var(--olive)] focus:ring-1 focus:ring-[var(--olive)]/30"
        />
      </div>

      <div>
        <label htmlFor="contact" className="text-sm font-medium text-[var(--graphite)]">
          Телефон або спосіб зв&apos;язку *
        </label>
        <input
          id="contact"
          name="contact"
          required
          autoComplete="tel"
          placeholder="+380..."
          className="mt-2 w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-sm outline-none focus:border-[var(--olive)] focus:ring-1 focus:ring-[var(--olive)]/30"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="hasMilitaryExperience"
            className="text-sm font-medium text-[var(--graphite)]"
          >
            Військовий досвід
          </label>
          <select
            id="hasMilitaryExperience"
            name="hasMilitaryExperience"
            className="mt-2 w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-sm outline-none focus:border-[var(--olive)] focus:ring-1 focus:ring-[var(--olive)]/30"
            defaultValue=""
          >
            <option value="">Не вказано</option>
            <option value="yes">Так</option>
            <option value="no">Ні</option>
            <option value="unknown">Не хочу вказувати</option>
          </select>
        </div>
        <div>
          <label htmlFor="direction" className="text-sm font-medium text-[var(--graphite)]">
            Цікавий напрям
          </label>
          <select
            id="direction"
            name="direction"
            className="mt-2 w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-sm outline-none focus:border-[var(--olive)] focus:ring-1 focus:ring-[var(--olive)]/30"
            defaultValue=""
          >
            <option value="">Обрати...</option>
            {directions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
            <option value="Інше">Інше / порадьте</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium text-[var(--graphite)]">
          Повідомлення
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="mt-2 w-full resize-y rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-sm outline-none focus:border-[var(--olive)] focus:ring-1 focus:ring-[var(--olive)]/30"
          placeholder="Коротко про себе — без чутливих деталей про поточну службу чи локації"
        />
      </div>

      {/* Honeypot */}
      <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="flex items-start gap-3 text-sm text-[var(--ink-soft)]">
        <input
          type="checkbox"
          name="privacyAccepted"
          required
          className="mt-1 h-4 w-4 accent-[var(--olive)]"
        />
        <span>
          Ознайомлений(-а) з{" "}
          <a href="/privacy" className="underline underline-offset-2">
            політикою конфіденційності
          </a>{" "}
          і даю згоду на обробку даних для зв&apos;язку з рекрутером.
        </span>
      </label>

      {status === "ok" ? (
        <p className="border border-[var(--olive)]/30 bg-[var(--olive)]/10 px-4 py-3 text-sm text-[var(--olive-deep)]">
          {siteCopy.form.success} ({siteConfig.workingHours}).
        </p>
      ) : null}
      {status === "error" ? (
        <p className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex h-12 w-full items-center justify-center bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--ink-inverse)] disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? "Надсилаємо..." : "Надіслати звернення"}
      </button>

      <p className="text-xs text-[var(--muted)]">
        Або заповніть{" "}
        <a
          href={siteConfig.applicationFormUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          {siteCopy.form.altGoogle}
        </a>
        , або{" "}
        <a href={`tel:${siteConfig.phone}`} className="underline">
          зателефонуйте
        </a>
        .
      </p>
    </form>
  );
}
