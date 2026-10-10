# Аудит сайту 14 ОРБ

Дата: 2026-10-09  
Середовище: локальний Next.js (`localhost:3000`) + Playwright.  
Production `https://14orb.co.ua/` у цій сесії не рендерився безпосередньо (локальний репозиторій — джерело виправлень).

## Стек і функціонал (збережено)

| Шар | Технологія |
|-----|------------|
| Framework | Next.js 16 App Router, React 19 |
| Styles | Tailwind CSS v4, design tokens у `globals.css` |
| Motion | framer-motion (`Reveal`, `TextReveal`) |
| DB | Neon Postgres + Drizzle |
| Auth | JWT cookie (`jose` + bcrypt), `/admin/*` |
| Forms | `/api/applications`, Zod validation |
| Content | `src/content/site-copy.ts`, `image-catalog.ts` |

**Не можна втратити:** рекрутинг-форму, каталог вакансій, новини, збори/Monobank, адмін CRUD, health API, SEO sitemap/robots.

## Перевірені маршрути

| Маршрут | HTTP | Примітка |
|---------|------|----------|
| `/` | 200 | Home + усі секції |
| `/join` | 200 | Форма `#form` |
| `/vacancies`, `/vacancies/[slug]` | 200 | Динамічні з БД |
| `/news`, `/news/[slug]` | 200 | |
| `/support` | 200 | Client fetch `/api/campaigns` |
| `/contacts`, `/about`, `/history`, `/people`, `/privacy` | 200 | |
| `/admin/login` | 200 | |
| `/admin`, `/admin/news|vacancies|campaigns|applications` | (auth) | Не ламали |
| `/api/health`, `/api/campaigns`, `/api/applications` | — | Без змін бекенду |
| Неіснуючий шлях | 404 | Кастомний `not-found.tsx` |

Viewport-перевірки Playwright: **320**, **375**, **1280**. Додаткові ширини (390–1920) — частково через overflow-фікс + `overflow-x: clip`.

## Знайдені проблеми та статус

### P0 — критичні
Немає. Build, lint, typecheck проходять. Сайт стартує.

### P1 — високі

| Проблема | Причина | Виправлення |
|----------|---------|-------------|
| Горизонтальний скрол на ~1280px | CTA «Зв’язатися з рекрутером» у вузькій колонці `#recruiting` + `whitespace-nowrap` + `sm:flex-row` | Колонка кнопок; `whitespace-normal` на кнопках до `sm` |
| H1 без пробілів для a11y | `TextReveal` різав слова в span без текстових пробілів | `aria-label` з повним текстом; візуальні span з `aria-hidden` |

### P2 — середні

| Проблема | Причина | Виправлення |
|----------|---------|-------------|
| Немає брендованих 404/error | Відсутні файли | Додано `not-found.tsx`, `error.tsx` |
| Desktop nav без «Історія»/«Контакти» | `nav.slice(0, 6)` | Повний `nav` + wrap |
| Invalid HTML у списках | `<ol><Reveal><li>` | `<ol><li><Reveal>` |
| Warning: Image quality 92 | Не в `images.qualities` | `next.config.ts` → `[75, 85, 92]` |
| Warning: fill height 0 | `ThemedImage` без розміру батька | `absolute inset-0` у about/recruiting; фіксований `h` у PageHeader media |
| Мобільне меню без скролу | Довгий список | `max-h` + `overflow-y-auto` |

### P3 — низькі / відкриті

| Проблема | Статус |
|----------|--------|
| `public/brand/perednya.png` ~5.8 MB не використовується | Залишено; оптимізувати/видалити окремо |
| Hero — архівна графіка, не офіційне фото | Потрібне погоджене фото від батальйону |
| Дати історії з seed (Wikipedia тощо) | Потрібне погодження |
| Production `14orb.co.ua` | Не перевірявся live у цій сесії — деплой окремо |
| E2E відправка форми / login адмінки | Не ганяли end-to-end з реальними даними |
| Unit-тестів у репо немає | N/A |

## Змінені файли

- `src/components/ui/text-reveal.tsx` — a11y H1
- `src/components/ui/button.tsx` — wrap тексту на вузьких екранах
- `src/components/home/recruiting.tsx` — CTA layout + image fill
- `src/components/home/about.tsx` — image fill
- `src/components/home/directions.tsx` — семантика списку
- `src/components/home/join-steps.tsx` — семантика списку / grid
- `src/components/layout/header.tsx` — повне меню, scroll drawer
- `src/components/layout/page-frame.tsx` — висота media
- `src/app/not-found.tsx`, `src/app/error.tsx` — системні сторінки
- `src/app/globals.css` — `overflow-x: clip`
- `next.config.ts` — `images.qualities`
- `docs/site-audit.md` — цей звіт

## Результати перевірок

| Команда | Результат |
|---------|-----------|
| `npm run build` | ✅ OK |
| `npm run lint` | ✅ OK |
| `npm run content:check` | ✅ 0 дублів |
| Unit / e2e suite | ❌ відсутні в проєкті |
| Playwright (локально) | ✅ маршрути 200/404; overflow усунуто на 320/1280; console без React-помилок (404 на тестовому шляху очікуваний) |

## Браузер (Playwright)

Перевірено:
- Home desktop 1280 — overflow до/після фіксу
- Home mobile 375 / 320 — без overflow; H1 `aria-label` коректний
- `/join` — форма `#form`, media banner
- `/vacancies` — відкривається
- HTTP-статуси всіх публічних маршрутів + 404

Не перевірено вручну end-to-end: submit форми з реальною БД-відповіддю, логін адміна, live production.

## Потрібне погодження / ручна перевірка

1. Офіційне фото для Hero (замість архівної графіки).
2. Тексти/дати історії та CMS-записи в Neon (seed не перезаписує існуючі).
3. Після деплою на Vercel — smoke-тест `14orb.co.ua` (SSL, env, DB).
4. Перевірка форми звернення в production з honeypot/rate-limit.

## Критерій завершення

- Сайт збирається і лінтиться.
- Основні маршрути відповідають.
- Горизонтальний скрол від CTA усунуто.
- Навігація показує всі пункти.
- 404/error оформлені.
- Контент-дублі не виявлено автоматичною перевіркою.
