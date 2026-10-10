# Intelligence Editorial + Tactical Technology

Єдина візуальна мова сайту 14 ОРБ. Не HUD і не «neon military» — а **редакційний** сайт з **тактичною** стриманістю.

## Принципи

| Editorial | Tactical |
|-----------|----------|
| Великі заголовки (Lora), асиметрія, повітря | Graphite / olive / brass, mono-метки, тонка сітка |
| Фото як доказ, підписи | Grain, hairline-лінії, без декоративного радару |
| Чергування light / ink секцій | Чіткі CTA, мінімум ефектів |

## Токени (`globals.css`)

- **Контейнер:** `max-w-7xl`, padding `px-5 md:px-8`
- **Секції:** `.section-pad` — вертикальні відступи `clamp(4rem, 10vw, 7rem)`
- **Поверхні:** `.surface-paper` (milk), `.surface-ink` (graphite)
- **Типографіка:** `.font-editorial` (Lora) — заголовки; Manrope — текст; JetBrains — мета

## Компоненти

- `Section`, `Kicker`, `DisplayTitle`, `Lead` — `src/components/ui/section.tsx`
- `PageFrame`, `PageHeader`, `BackLink` — `src/components/layout/page-frame.tsx`
- `Button` / `LinkButton` — shadcn-style cva
- `Reveal` — framer-motion, `prefers-reduced-motion`

## Сітки секцій (головна)

1. **Hero** — кінематографічне фото, мінімум UI, 2 CTA
2. **About** — 12-колонка: фото 5 + текст 7, pull-quote офіційного тексту
3. **Directions** — sticky intro + список 01–06 (не картки)
4. **Recruiting** — вимоги + компактні рядки вакансій
5. **Join steps** — timeline (mobile vertical / desktop horizontal)
6. **News** — featured + список
7. **Support** — ink band, реквізити mono
8. **Final CTA** — paper panel

## Зображення

Каталог, alt-тексти, промпти: **[IMAGES.md](./IMAGES.md)**. Компоненти: `ThemedImage`, `SectionBackdrop`, `src/content/image-catalog.ts`.

## Анімації

- Framer Motion: hero fade, scroll reveal, header
- Без GSAP
- Aceternity TextReveal — лише hero H1
- Без Spotlight на hero (прибрано перевантаження)

## Внутрішні сторінки

Усі через `PageFrame` + `PageHeader`. Header на внутрішніх маршрутах — **paper** з темним текстом з першого пікселя.
