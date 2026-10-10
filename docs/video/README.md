# Відеогайд «Як подати заявку»

## Файли

| Файл | Опис |
|------|------|
| `../../public/media/yak-podaty-zayavku.webm` | Фінальне відео на сайті (`/guide/apply`) |
| `yak-podaty-zayavku.recordly` | Проєкт для [Recordly](https://github.com/DougNix/recordly) (zoom regions + telemetry) |
| `cursor-*.svg` | Курсори з Recordly |

## Перезапис (Recordly-style)

```bash
npm run video:apply-guide:recordly
```

Скрипт знімає прохід по сайту зі soft-zoom, студійною рамкою та курсором у стилі Recordly, потім зберігає `.recordly` проєкт для подальшого полірування в застосунку.

## Відкрити в Recordly

1. Встановіть [Recordly v1.4.0](https://github.com/webadderallorg/Recordly/releases/tag/v1.4.0) (macOS arm64).
2. Відкрийте застосунок → Import video → оберіть `yak-podaty-zayavku.webm`.
3. Або імпортуйте `yak-podaty-zayavku.recordly`, якщо версія підтримує відкриття проєкту з диска.
4. Увімкніть auto-zoom / cursor polish → Export MP4.
