import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import * as schema from "./schema";

config({ path: ".env.local" });

async function main() {
  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL missing");

  const db = drizzle(neon(url), { schema });

  const email = process.env.ADMIN_BOOTSTRAP_EMAIL || "admin@14orb.local";
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD || "ChangeMeAfterFirstLogin!";

  const existing = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(schema.users).values({
      email,
      name: "Адміністратор",
      role: "admin",
      passwordHash: await hash(password, 12),
    });
    console.log("Admin user created:", email);
  } else {
    console.log("Admin user already exists");
  }

  const categories = [
    { name: "Новини", slug: "novyny" },
    { name: "Події", slug: "podii" },
    { name: "Подяки", slug: "podyaky" },
  ];

  for (const cat of categories) {
    const found = await db
      .select()
      .from(schema.newsCategories)
      .where(eq(schema.newsCategories.slug, cat.slug))
      .limit(1);
    if (found.length === 0) {
      await db.insert(schema.newsCategories).values(cat);
    }
  }

  // Placeholder vacancies — titles only as recruiting directions pending official confirmation.
  // Status open but descriptions marked for approval where needed.
  const vacancySeeds = [
    {
      title: "Оператор БпЛА",
      slug: "operator-bpla",
      shortDescription:
        "Робота з безпілотними системами. Детальні вимоги та умови — після консультації з рекрутером.",
      description:
        "Напрям потребує офіційного уточнення вимог і умов служби через рекрутера батальйону.",
      requirements:
        "Базові вимоги — як у рекрутингу батальйону; додаткові навички з БпЛА уточнює рекрутер.",
      direction: "Безпілотні системи",
      status: "open" as const,
      sortOrder: 1,
    },
    {
      title: "Розвідник",
      slug: "rozvidnyk",
      shortDescription:
        "Служба в розвідувальному напрямі. Конкретні вимоги повідомляє рекрутер.",
      description:
        "Опис посади та умови комплектування уточнюються відповідальною особою батальйону.",
      requirements:
        "Відповідність загальним вимогам до кандидата; специфіка посади — після консультації.",
      direction: "Розвідувальна діяльність",
      status: "open" as const,
      sortOrder: 2,
    },
    {
      title: "Водій",
      slug: "vodiy",
      shortDescription: "Забезпечення мобільності підрозділу. Деталі — у рекрутера.",
      description: "Посада відкрита для звернень. Умови служби — за офіційним порядком комплектування.",
      requirements: "Категорія водійських прав і досвід — за погодженням з рекрутером.",
      direction: "Технічне забезпечення",
      status: "open" as const,
      sortOrder: 3,
    },
    {
      title: "Медик",
      slug: "medyk",
      shortDescription: "Медичне забезпечення особового складу. Деталі — у рекрутера.",
      description: "Посада відкрита для звернень. Кваліфікаційні вимоги уточнюються рекрутером.",
      requirements: "Медична освіта та кваліфікація перевіряються під час відбору.",
      direction: "Медицина",
      status: "open" as const,
      sortOrder: 4,
    },
  ];

  for (const v of vacancySeeds) {
    const found = await db
      .select()
      .from(schema.vacancies)
      .where(eq(schema.vacancies.slug, v.slug))
      .limit(1);
    if (found.length === 0) {
      await db.insert(schema.vacancies).values(v);
    }
  }

  const campaigns = await db.select().from(schema.supportCampaigns).limit(1);
  if (campaigns.length === 0) {
    await db.insert(schema.supportCampaigns).values({
      title: "Підтримка батальйону",
      slug: "pidtrymka-batalyonu",
      description:
        "Офіційний збір на потреби 14 ОРБ. Реквізити з офіційного сайту. Цільову суму та прогрес додавайте лише після підтвердження.",
      monobankUrl: "https://send.monobank.ua/jar/6eFKaDCcuv",
      cardNumber: "4441111126857253",
      status: "active",
      // goal/raised intentionally null until officially confirmed
    });
  }

  const about = await db
    .select()
    .from(schema.sitePages)
    .where(eq(schema.sitePages.key, "about"))
    .limit(1);

  if (about.length === 0) {
    await db.insert(schema.sitePages).values({
      key: "about",
      title: "Хто ми",
      body: `14 окремий розвідувальний батальйон — це очі і вуха Збройних сил. Завдяки досвіду та технологіям ми рятуємо життя та змінюємо хід бойових дій.

На цій сторінці — розширений текст для тих, хто шукає офіційне формулювання. Короткий огляд ролі розвідки на головній не дублює цей абзац дослівно.

[Потребує погодження: структура, хронологія, фото та бойовий шлях — лише після затвердження штабом.]`,
      seoTitle: "Хто ми — 14 ОРБ",
      seoDescription:
        "Офіційне формулювання про 14-й окремий розвідувальний батальйон ЗСУ.",
      status: "published",
    });
  }

  const history = await db
    .select()
    .from(schema.sitePages)
    .where(eq(schema.sitePages.key, "history"))
    .limit(1);

  if (history.length === 0) {
    await db.insert(schema.sitePages).values({
      key: "history",
      title: "Історія та традиції",
      body: `Публічні відомості (джерела: офіційний сайт, Wikipedia / MilitaryLand — потребують редакційної перевірки перед фінальною публікацією):

• Березень 2022 — формування 14-го окремого стрілецького батальйону в Рівненській області.
• Серпень 2025 — переформування на 14-й окремий розвідувальний батальйон.

Детальна хронологія, фотографії та історії особового складу додаються лише після погодження відповідальною особою батальйону.`,
      seoTitle: "Історія — 14 ОРБ",
      seoDescription: "Історія та традиції 14-го окремого розвідувального батальйону.",
      status: "published",
    });
  }

  console.log("Seed complete");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
