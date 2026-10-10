# Деплой 14 ОРБ: Neon + Vercel

## Архітектура

- **Frontend / API:** Next.js App Router на Vercel
- **Database:** Neon Postgres (`aws-eu-central-1`)
- **ORM:** Drizzle + `@neondatabase/serverless` (HTTP, підходить для serverless)

Neon project (створено): `14orb-website` · id `weathered-field-27809363`

## Змінні середовища

Скопіюйте `.env.example` → `.env.local` (локально) і додайте ті самі ключі у Vercel → Project → Settings → Environment Variables.

| Змінна | Призначення |
|---|---|
| `DATABASE_URL` | Pooled Neon URL (`-pooler`) — runtime на Vercel |
| `DATABASE_URL_UNPOOLED` | Direct Neon URL — міграції (`drizzle-kit push`) |
| `AUTH_SECRET` | Підпис сесій адмінки (`openssl rand -hex 32`) |
| `ADMIN_BOOTSTRAP_EMAIL` | Email першого адміна для seed |
| `ADMIN_BOOTSTRAP_PASSWORD` | Пароль першого адміна (змініть після входу) |
| `NEXT_PUBLIC_SITE_URL` | Публічний URL (`https://14orb.co.ua`) |

Ніколи не комітьте `.env.local` і не вставляйте паролі БД у клієнтський код.

## Локальний запуск

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Адмінка: `/admin/login`

## Vercel

1. Імпортуйте репозиторій у Vercel (Framework: Next.js).
2. Додайте env vars (Production + Preview).
3. Для Preview бажано окремий Neon branch + окремий `DATABASE_URL` (опційно).
4. Deploy. Після першого деплою локально або через CI виконайте:

```bash
npm run db:push
npm run db:seed
```

Або підключіть Neon Integration у Vercel Marketplace — вона підставить `DATABASE_URL` автоматично; тоді переконайтесь, що schema вже застосована.

## Домен 14orb.co.ua

Поточний хостинг офіційного сайту повертає **402 Payment Required**. Після готовності нового сайту:

1. Додайте домен у Vercel.
2. Оновіть DNS (A/CNAME за підказкою Vercel).
3. Оновіть SSL.
4. Встановіть `NEXT_PUBLIC_SITE_URL=https://14orb.co.ua`.

## Безпека

- Не публікуйте оперативні дані, координати, непогоджені фото/імена.
- Звернення кандидатів доступні лише ролям `admin` / `recruiter`.
- Форма має honeypot + серверну валідацію Zod.
- Після першого входу змініть bootstrap-пароль адміна.
