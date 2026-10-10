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
| `FACEBOOK_PAGE_ID` | ID або username сторінки (`14osb`) — для стрічки новин |
| `FACEBOOK_PAGE_ACCESS_TOKEN` | Page access token з Meta for Developers (див. нижче) |

Ніколи не комітьте `.env.local` і не вставляйте паролі БД у клієнтський код.

### Новини з Facebook / Instagram

1. Створіть [Meta for Developers](https://developers.facebook.com/) app (тип Business).
2. Додайте продукт **Facebook Login for Business** або **Pages API**.
3. Отримайте **Page access token** для сторінки [14osb](https://www.facebook.com/14osb/) з правами `pages_read_engagement` (і `instagram_basic` / `pages_show_list`, якщо потрібен Instagram).
4. Додайте у Vercel (Production):
   - `FACEBOOK_PAGE_ID=14osb`
   - `FACEBOOK_PAGE_ACCESS_TOKEN=…` (довгостроковий page token)
5. Redeploy. Розділ `/news` і блок на головній підтягнуть пости через Graph API (кеш ~15 хв).

Без токена на `/news` показуються **вбудовані стрічки** Facebook і Instagram.

#### Instagram у списку новин (2 варіанти)

**A. Через Facebook-сторінку (найпростіше)**  
Якщо `@14_orb` прив’язано до сторінки `14osb` у Meta Business Suite — достатньо `FACEBOOK_PAGE_ACCESS_TOKEN`; пости Instagram підтягнуться автоматично.

**B. Лише Instagram (окремі змінні)**  
| `INSTAGRAM_USER_ID` | Numeric ID business/creator акаунта |
| `INSTAGRAM_ACCESS_TOKEN` | Long-lived token з продукту **Instagram API** у Meta app |

Facebook-токен для цього варіанту не обов’язковий.

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
