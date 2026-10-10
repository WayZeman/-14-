"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Помилка входу");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--graphite)] px-5">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md border border-white/10 bg-[var(--graphite-soft)] p-8 text-white"
      >
        <h1 className="font-display text-2xl font-semibold">Адмінпанель 14 ОРБ</h1>
        <p className="mt-2 text-sm text-white/60">Лише для уповноважених осіб</p>

        <label className="mt-8 block text-sm">
          Email
          <input
            name="email"
            type="email"
            required
            className="mt-2 w-full border border-white/15 bg-black/30 px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
          />
        </label>
        <label className="mt-4 block text-sm">
          Пароль
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="mt-2 w-full border border-white/15 bg-black/30 px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
          />
        </label>

        {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex h-12 w-full items-center justify-center bg-[var(--accent)] text-sm font-semibold text-[var(--ink-inverse)] disabled:opacity-60"
        >
          {loading ? "Вхід..." : "Увійти"}
        </button>
      </form>
    </div>
  );
}
