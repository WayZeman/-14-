import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { AdminShell } from "@/components/admin/shell";
import { AdminField, AdminSubmit } from "@/components/admin/field";
import {
  CMS_PAGES,
  CMS_SETTINGS,
  getAllSitePages,
  getSettingForAdmin,
  pageDefaults,
  type CmsPageKey,
  type CmsSettingKey,
} from "@/lib/cms";
import { savePageAction, saveSettingAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const { saved } = await searchParams;
  const pages = await getAllSitePages();
  const byKey = new Map(pages.map((p) => [p.key, p]));

  const settings = await Promise.all(
    CMS_SETTINGS.map(async (s) => ({
      ...s,
      values: await getSettingForAdmin(s.key as CmsSettingKey),
    })),
  );

  return (
    <AdminShell user={user}>
      <h1 className="font-display text-3xl font-semibold">Тексти сайту</h1>
      <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
        Редагуйте блоки сторінок і контактні дані. Якщо поле порожнє в базі — на сайті
        показується значення за замовчуванням.
      </p>

      {saved ? (
        <p className="mt-4 border border-[var(--olive)]/30 bg-[var(--olive)]/10 px-4 py-2 text-sm">
          Збережено: {saved}
        </p>
      ) : null}

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold">Налаштування</h2>
        <div className="mt-4 space-y-6">
          {settings.map((block) => (
            <form
              key={block.key}
              id={block.key}
              action={saveSettingAction}
              className="space-y-3 border border-[var(--graphite)]/10 bg-white p-5"
            >
              <input type="hidden" name="key" value={block.key} />
              <h3 className="font-semibold">{block.label}</h3>
              {block.fields.map((field) => (
                <AdminField
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  type={field.type === "textarea" ? "textarea" : "text"}
                  rows={field.type === "textarea" ? 4 : undefined}
                  defaultValue={block.values[field.name] ?? ""}
                />
              ))}
              <AdminSubmit />
            </form>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold">Сторінки та блоки</h2>
        <div className="mt-4 space-y-6">
          {CMS_PAGES.map((meta) => {
            const row = byKey.get(meta.key);
            const defaults = pageDefaults(meta.key as CmsPageKey);
            return (
              <form
                key={meta.key}
                id={`page-${meta.key}`}
                action={savePageAction}
                className="space-y-3 border border-[var(--graphite)]/10 bg-white p-5"
              >
                <input type="hidden" name="key" value={meta.key} />
                <div>
                  <h3 className="font-semibold">{meta.label}</h3>
                  <p className="mt-1 text-xs text-[var(--muted)]">{meta.hint}</p>
                </div>
                <AdminField
                  label="Заголовок"
                  name="title"
                  required
                  defaultValue={row?.title ?? defaults.title}
                />
                <AdminField
                  label="Текст"
                  name="body"
                  type="textarea"
                  rows={8}
                  defaultValue={row?.body ?? defaults.body}
                />
                <AdminField
                  label="SEO title (опційно)"
                  name="seoTitle"
                  defaultValue={row?.seoTitle ?? ""}
                />
                <AdminField
                  label="SEO description (опційно)"
                  name="seoDescription"
                  type="textarea"
                  rows={2}
                  defaultValue={row?.seoDescription ?? ""}
                />
                <AdminSubmit />
              </form>
            );
          })}
        </div>
      </section>
    </AdminShell>
  );
}
