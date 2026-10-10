# 14 ОРБ — офіційний сайт

Сучасний сайт 14-го окремого розвідувального батальйону ЗСУ.

**Стек:** Next.js · Tailwind CSS · Drizzle ORM · Neon Postgres · Vercel

## Швидкий старт

```bash
npm install
cp .env.example .env.local   # додайте Neon DATABASE_URL
npm run db:push
npm run db:seed
npm run dev
```

Деталі деплою: [docs/DEPLOY.md](docs/DEPLOY.md)

## Сторінки

- `/` — головна (hero, хто ми, напрямки, рекрутинг, кроки, новини, підтримка)
- `/join` — форма кандидата + FAQ
- `/vacancies`, `/news`, `/support`, `/history`, `/people`, `/contacts`, `/privacy`
- `/admin` — захищена адмінпанель (новини, вакансії, збори, звернення)

## Контент

Публічні контакти й реквізити перенесено з архіву офіційного сайту `14orb.co.ua`.  
Вигадані бойові факти, зарплати та чутливі дані не додаються.
