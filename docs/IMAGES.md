# Візуальна концепція зображень 14 ОРБ

## Стиль

**Military documentary photography · cinematic realism · intelligence technology**

- Палітра: desaturated olive, graphite, warm brass accents (у кадрі — природні, без пост-неону).
- Світло: пасмарно, ранок/вечір, м’які тіні.
- Заборонено в кадрі: текст, емблеми, шеврони, водяні знаки, «кібер-радар», neon HUD, фантастична зброя.

**Юридично-редакційно:** файли в `public/images/` — **ілюстративні атмосферні кадри**, не документування реальних операцій. Офіційне фото підрозділу — лише `public/brand/hero.jpg` (Hero).

## Генерація: що перевірено

| Варіант | Доступність у цьому репо | Висновок |
|---------|---------------------------|----------|
| **ComfyUI** | Не встановлено; потрібен GPU, десятки GB моделей | Локально — лише за окремим рішенням |
| **FLUX / FLUX2** (self-host) | Те саме | API (BFL, Replicate тощо) — потрібні ключі та бюджет; **ключів у `.env` немає** |
| **Cursor GenerateImage** | Використано для першого набору | Швидко, без інфраструктури; збережено в `public/images/` |
| **Офіційні файли** | `brand/hero.jpg`, `brand/perednya.png` | Hero — офіційний; `perednya.png` (~5.8 MB) — оптимізувати перед production |

## Каталог файлів

| Файл | Співвідношення | Призначення |
|------|----------------|-------------|
| `images/sections/hero-home.webp` | 16:9 | **Hero** (атмосферний кадр, без watermark) |
| `brand/hero.jpg` | — | Архів; AI-графіка з watermark — **не на Hero** |
| `sections/hero-atmosphere.webp` | 16:9 | Фон `/join`, optional overlay |
| `sections/directions-field.webp` | 16:9 | Фон секції «Напрямки» |
| `sections/technology-uav.webp` | 4:3 | Рекрутинг / технології |
| `sections/team-coordination.webp` | 4:3 | Блок «Хто ми» |
| `sections/recruiting-path.webp` | 16:9 | Кроки долучення |
| `sections/history-archive.webp` | 4:3 | Сторінка історії |
| `sections/background-mist.webp` | 16:9 | Тонкі фони секцій (CSS) |

Alt-тексти — у `src/content/image-catalog.ts`.

## Оптимізація

```bash
npm run images:optimize
```

Скрипт `scripts/optimize-images.mjs` (sharp): WebP, max width 1920 (hero/sections), 640 (cards), quality ~82.

Джерела для перегенерації кладуться в  
`~/.cursor/projects/Users-macbook-Desktop-14orb-website/assets/*.jpg`  
(або локальний `.cursor/projects/.../assets`).

Після генерації — знову `npm run images:optimize`.

**Розмір після оптимізації (орієнтовно):** directions ~120 KB, recruiting-path ~194 KB, background-mist ~23 KB, cards ~37 KB.

## Промпти (якщо перегенеровувати у ComfyUI / FLUX API)

Спільний суфікс для всіх:

> Documentary military photography, cinematic realism, reconnaissance mood, desaturated olive and graphite color grade, natural overcast light, no text, no logos, no insignia, no watermarks, no sci-fi gear, no neon HDR, anonymous figures from behind only.

1. **directions-field** (1920×1080): Wide Ukrainian steppe and tree line from elevated angle, empty terrain, intelligence observation mood, film grain.
2. **technology-uav** (1200×900): Close-up of rugged laptop and consumer-grade drone on tailgate, gloved hands, olive field jacket sleeves, shallow DOF.
3. **team-coordination** (1200×900): Three soldiers seen from behind studying paper map on hood of military pickup, muted greens, documentary.
4. **recruiting-path** (1920×1080): Dirt road through forest at dawn, single figure walking away in fatigues silhouette, hopeful restrained tone.
5. **history-archive** (1200×900): Empty wooden table with old folded map and thermos, faded archival color cast, no dates.
6. **background-mist** (1920×1080): Abstract pine forest in fog, dark graphite tones, minimal detail for web background.
7. **hero-atmosphere** (1920×1080): Same as recruiting-path but wider composition, more sky, for interior page headers only.
