/**
 * Records a short walkthrough video: how to apply via 14orb.co.ua
 * Output: public/media/yak-podaty-zayavku.webm
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public", "media");
const tmpDir = path.join(root, "docs", "video", "tmp");

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(tmpDir, { recursive: true });

const SITE = process.env.SITE_URL || "https://14orb.co.ua";

async function caption(page, title, detail = "") {
  await page.evaluate(
    ({ title, detail }) => {
      let el = document.getElementById("orb-guide-caption");
      if (!el) {
        el = document.createElement("div");
        el.id = "orb-guide-caption";
        el.style.cssText = [
          "position:fixed",
          "left:24px",
          "right:24px",
          "bottom:28px",
          "z-index:2147483647",
          "padding:18px 22px",
          "border-radius:12px",
          "background:rgba(18,22,28,0.92)",
          "color:#fff",
          "font-family:system-ui,-apple-system,sans-serif",
          "box-shadow:0 12px 40px rgba(0,0,0,.45)",
          "pointer-events:none",
          "max-width:720px",
        ].join(";");
        document.body.appendChild(el);
      }
      el.innerHTML = `<div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;opacity:.7;margin-bottom:6px">14 ОРБ · Як подати заявку</div>
        <div style="font-size:22px;font-weight:700;line-height:1.25">${title}</div>
        ${detail ? `<div style="margin-top:8px;font-size:15px;line-height:1.45;opacity:.85">${detail}</div>` : ""}`;
    },
    { title, detail },
  );
}

async function pause(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: "uk-UA",
    recordVideo: {
      dir: tmpDir,
      size: { width: 1440, height: 900 },
    },
  });
  const page = await context.newPage();

  // 1. Home
  await page.goto(SITE, { waitUntil: "networkidle", timeout: 60000 });
  await pause(800);
  await caption(
    page,
    "Крок 1. Відкрийте офіційний сайт",
    "Зайдіть на 14orb.co.ua — головна сторінка батальйону.",
  );
  await pause(2800);

  // 2. Click join CTA
  await caption(
    page,
    "Крок 2. Натисніть «Приєднатися»",
    "Кнопка на головному екрані або в меню веде до форми звернення.",
  );
  await pause(1600);
  const joinCta = page.getByRole("link", { name: /Приєднатися/i }).first();
  await joinCta.click();
  await page.waitForURL(/\/join/, { timeout: 30000 });
  await page.waitForLoadState("networkidle");
  await pause(1000);

  // 3. Join page intro
  await caption(
    page,
    "Крок 3. Сторінка «Приєднатися»",
    "Тут є телефон рекрутера, соцмережі та форма звернення.",
  );
  await pause(2500);

  // 4. Scroll to form
  await caption(
    page,
    "Крок 4. Знайдіть форму звернення",
    "Прокрутіть до блоку з полями або відкрийте посилання з #form.",
  );
  const form = page.locator("form#form");
  await form.scrollIntoViewIfNeeded();
  await pause(2200);

  // 5. Fill fields
  await caption(
    page,
    "Крок 5. Заповніть обов'язкові поля",
    "Ім'я та телефон (або інший спосіб зв'язку) — обов'язкові.",
  );
  await form.locator("#name").click();
  await form.locator("#name").fill("Демо Кандидат");
  await pause(700);
  await form.locator("#contact").click();
  await form.locator("#contact").fill("+380950000000");
  await pause(1200);

  await caption(
    page,
    "Крок 6. Додайте деталі (за бажанням)",
    "Військовий досвід, напрям і коротке повідомлення — без чутливих даних.",
  );
  await form.locator("#hasMilitaryExperience").selectOption("yes");
  await pause(600);
  const direction = form.locator("#direction");
  const options = await direction.locator("option").allTextContents();
  const pick =
    options.find((o) => /розвід|бпла|оператор|інше/i.test(o)) ||
    options.find((o) => o && !/обрати/i.test(o)) ||
    "Інше";
  try {
    await direction.selectOption({ label: pick.trim() });
  } catch {
    await direction.selectOption({ value: "Інше" });
  }
  await pause(500);
  await form.locator("#message").fill("Коротко: цікавить служба в підрозділі. Демо-запис для відеогайду.");
  await pause(1800);

  // 7. Privacy
  await caption(
    page,
    "Крок 7. Підтвердіть політику конфіденційності",
    "Поставте галочку згоди — без неї форму не надіслати.",
  );
  await form.locator('input[name="privacyAccepted"]').check();
  await pause(2000);

  // 8. Show submit (do not send real application)
  await caption(
    page,
    "Крок 8. Натисніть «Надіслати звернення»",
    "Рекрутер відповість у робочі години. Або зателефонуйте / Google-форма.",
  );
  const submit = form.getByRole("button", { name: /Надіслати звернення/i });
  await submit.scrollIntoViewIfNeeded();
  await submit.evaluate((el) => {
    el.style.outline = "3px solid #c4a35a";
    el.style.outlineOffset = "4px";
  });
  await pause(3200);

  await caption(
    page,
    "Готово",
    "Заявку розглянуть і зв'яжуться з вами. Дякуємо за інтерес до 14 ОРБ.",
  );
  await pause(2800);

  const videoPath = await page.video()?.path();
  await context.close();
  await browser.close();

  if (!videoPath || !fs.existsSync(videoPath)) {
    throw new Error("Video file was not created");
  }

  const dest = path.join(outDir, "yak-podaty-zayavku.webm");
  fs.copyFileSync(videoPath, dest);
  // cleanup tmp
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {
    /* ignore */
  }

  const stat = fs.statSync(dest);
  console.log(JSON.stringify({ ok: true, file: dest, bytes: stat.size }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
