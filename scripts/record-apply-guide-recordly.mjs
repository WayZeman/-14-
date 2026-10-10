/**
 * Professional apply-guide recording inspired by Recordly
 * (https://github.com/DougNix/recordly): studio frame, soft zoom on
 * interactions, custom cursor, telemetry + .recordly project for polish.
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public", "media");
const docsDir = path.join(root, "docs", "video");
const tmpDir = path.join(docsDir, "tmp-recordly");
const FF = "/Users/macbook/Library/Caches/ms-playwright/ffmpeg-1013/ffmpeg-mac";
const SITE = process.env.SITE_URL || "https://14orb.co.ua";

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(docsDir, { recursive: true });
fs.mkdirSync(tmpDir, { recursive: true });

const cursorDefault = fs
  .readFileSync(path.join(docsDir, "cursor-default.svg"), "utf8")
  .replace(/"/g, "'")
  .replace(/\n/g, "");
const cursorPointer = fs
  .readFileSync(path.join(docsDir, "cursor-pointer.svg"), "utf8")
  .replace(/"/g, "'")
  .replace(/\n/g, "");

const telemetry = [];
const zoomRegions = [];
const annotations = [];
let t0 = 0;

function nowMs() {
  return Date.now() - t0;
}

function pushZoom(focus, holdMs = 1600, depth = 3) {
  const start = nowMs();
  zoomRegions.push({
    id: randomUUID(),
    startMs: start,
    endMs: start + holdMs,
    depth,
    focus,
  });
}

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

async function installStudio(page) {
  await page.addStyleTag({
    content: `
      html { background: #0b0f14 !important; }
      body {
        cursor: none !important;
        background:
          radial-gradient(1200px 700px at 20% 10%, #1c2838 0%, transparent 55%),
          radial-gradient(900px 600px at 85% 80%, #243428 0%, transparent 50%),
          linear-gradient(160deg, #10161e 0%, #0b0f14 45%, #121a14 100%) !important;
      }
      body > *:not(#orb-studio-chrome):not(#orb-guide-caption):not(#orb-custom-cursor):not(#orb-title-card) {
        /* content stays as-is; framing via chrome overlay */
      }
      * { cursor: none !important; }
      #orb-studio-chrome {
        position: fixed; inset: 0; z-index: 2147483000; pointer-events: none;
        padding: 56px 64px 88px;
        box-sizing: border-box;
      }
      #orb-studio-chrome .frame {
        width: 100%; height: 100%;
        border-radius: 18px;
        box-shadow:
          0 40px 100px rgba(0,0,0,.55),
          0 2px 0 rgba(255,255,255,.06) inset;
        outline: 1px solid rgba(255,255,255,.08);
        /* punch a hole so page shows through */
        background: transparent;
        box-shadow:
          0 0 0 9999px rgba(11,15,20,.0),
          0 40px 100px rgba(0,0,0,.55);
      }
      /* Dim outside by using a mask ring via four bars */
      #orb-studio-chrome .pad-t,
      #orb-studio-chrome .pad-b,
      #orb-studio-chrome .pad-l,
      #orb-studio-chrome .pad-r {
        position: absolute; background: transparent;
        pointer-events: none;
      }
      #orb-custom-cursor {
        position: fixed; z-index: 2147483646; pointer-events: none;
        width: 36px; height: 36px; transform: translate(-4px, -2px);
        filter: drop-shadow(0 6px 10px rgba(0,0,0,.35));
        transition: transform 80ms ease-out;
      }
      #orb-custom-cursor.clicking { transform: translate(-4px, -2px) scale(.88); }
      #orb-guide-caption {
        position: fixed; left: 88px; bottom: 36px; z-index: 2147483645;
        max-width: 640px; padding: 16px 20px; border-radius: 14px;
        background: rgba(16,20,26,.92); color: #fff;
        font-family: "SF Pro Display", "Segoe UI", system-ui, sans-serif;
        box-shadow: 0 18px 50px rgba(0,0,0,.45);
        border: 1px solid rgba(255,255,255,.08);
        pointer-events: none;
        backdrop-filter: blur(10px);
      }
      #orb-title-card {
        position: fixed; inset: 0; z-index: 2147483647;
        display: flex; align-items: center; justify-content: center;
        background: radial-gradient(800px 500px at 50% 40%, #1a2430, #0b0f14 70%);
        color: #fff; font-family: "SF Pro Display", system-ui, sans-serif;
        pointer-events: none; opacity: 0; transition: opacity .45s ease;
      }
      #orb-title-card.show { opacity: 1; }
      #orb-zoom-root {
        transition: transform .55s cubic-bezier(.22,1,.36,1);
        transform-origin: center center;
      }
    `,
  });

  await page.evaluate(
    ({ cursorDefault, cursorPointer }) => {
      if (!document.getElementById("orb-studio-chrome")) {
        const chrome = document.createElement("div");
        chrome.id = "orb-studio-chrome";
        chrome.innerHTML = `<div class="frame"></div>`;
        document.documentElement.appendChild(chrome);
      }
      if (!document.getElementById("orb-custom-cursor")) {
        const c = document.createElement("div");
        c.id = "orb-custom-cursor";
        c.innerHTML = cursorDefault;
        document.documentElement.appendChild(c);
        window.__orbCursors = { default: cursorDefault, pointer: cursorPointer };
        window.addEventListener(
          "mousemove",
          (e) => {
            c.style.left = `${e.clientX}px`;
            c.style.top = `${e.clientY}px`;
          },
          true,
        );
      }
      if (!document.getElementById("orb-title-card")) {
        const t = document.createElement("div");
        t.id = "orb-title-card";
        document.documentElement.appendChild(t);
      }
      // wrap body children for zoom
      if (!document.getElementById("orb-zoom-root")) {
        const root = document.createElement("div");
        root.id = "orb-zoom-root";
        while (document.body.firstChild) root.appendChild(document.body.firstChild);
        document.body.appendChild(root);
      }
    },
    { cursorDefault, cursorPointer },
  );
}

async function setCursor(page, kind = "default") {
  await page.evaluate((kind) => {
    const c = document.getElementById("orb-custom-cursor");
    if (!c || !window.__orbCursors) return;
    c.innerHTML = kind === "pointer" ? window.__orbCursors.pointer : window.__orbCursors.default;
  }, kind);
}

async function caption(page, title, detail = "") {
  await page.evaluate(
    ({ title, detail }) => {
      let el = document.getElementById("orb-guide-caption");
      if (!el) {
        el = document.createElement("div");
        el.id = "orb-guide-caption";
        document.documentElement.appendChild(el);
      }
      el.innerHTML = `<div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;opacity:.55;margin-bottom:6px">14 ОРБ · Гайд · Recordly-style</div>
        <div style="font-size:21px;font-weight:650;line-height:1.25;letter-spacing:-.01em">${title}</div>
        ${detail ? `<div style="margin-top:8px;font-size:14.5px;line-height:1.45;opacity:.82">${detail}</div>` : ""}`;
    },
    { title, detail },
  );
  annotations.push({
    id: randomUUID(),
    type: "text",
    startMs: nowMs(),
    endMs: nowMs() + 2500,
    text: title,
    position: { x: 0.08, y: 0.82 },
    size: { width: 0.42, height: 0.14 },
    style: {
      color: "#ffffff",
      backgroundColor: "rgba(16,20,26,0.92)",
      fontSize: 28,
      fontFamily: "SF Pro Display",
      fontWeight: "bold",
      fontStyle: "normal",
      textDecoration: "none",
      textAlign: "left",
    },
  });
}

async function titleCard(page, title, subtitle = "", showMs = 2200) {
  await page.evaluate(
    ({ title, subtitle }) => {
      const el = document.getElementById("orb-title-card");
      if (!el) return;
      el.innerHTML = `<div style="text-align:center;padding:40px">
        <div style="font-size:13px;letter-spacing:.18em;text-transform:uppercase;opacity:.5;margin-bottom:18px">14 ОРБ</div>
        <div style="font-size:44px;font-weight:700;letter-spacing:-.03em;line-height:1.1">${title}</div>
        ${subtitle ? `<div style="margin-top:16px;font-size:18px;opacity:.7;max-width:520px;margin-left:auto;margin-right:auto;line-height:1.4">${subtitle}</div>` : ""}
      </div>`;
      el.classList.add("show");
    },
    { title, subtitle },
  );
  await sleep(showMs);
  await page.evaluate(() => document.getElementById("orb-title-card")?.classList.remove("show"));
  await sleep(400);
}

async function softZoom(page, locator, holdMs = 1500) {
  const box = await locator.boundingBox();
  if (!box) return;
  const vp = page.viewportSize();
  const cx = (box.x + box.width / 2) / vp.width;
  const cy = (box.y + box.height / 2) / vp.height;
  pushZoom({ cx, cy }, holdMs, 3);
  await page.evaluate(
    ({ cx, cy }) => {
      const root = document.getElementById("orb-zoom-root") || document.body;
      root.style.transformOrigin = `${cx * 100}% ${cy * 100}%`;
      root.style.transform = "scale(1.38)";
    },
    { cx, cy },
  );
  await sleep(holdMs);
  await page.evaluate(() => {
    const root = document.getElementById("orb-zoom-root") || document.body;
    root.style.transform = "scale(1)";
  });
  await sleep(450);
}

async function moveTo(page, locator, opts = {}) {
  const box = await locator.boundingBox();
  if (!box) return;
  const x = box.x + box.width * (opts.fx ?? 0.5);
  const y = box.y + box.height * (opts.fy ?? 0.5);
  const steps = opts.steps ?? 28;
  await setCursor(page, "pointer");
  await page.mouse.move(x, y, { steps });
  telemetry.push({
    timeMs: nowMs(),
    cx: x / page.viewportSize().width,
    cy: y / page.viewportSize().height,
    interactionType: "move",
    cursorType: "pointer",
  });
  await sleep(180);
}

async function clickAt(page, locator) {
  await moveTo(page, locator);
  const box = await locator.boundingBox();
  const vp = page.viewportSize();
  const cx = (box.x + box.width / 2) / vp.width;
  const cy = (box.y + box.height / 2) / vp.height;
  telemetry.push({
    timeMs: nowMs(),
    cx,
    cy,
    interactionType: "click",
    cursorType: "pointer",
  });
  await page.evaluate(() => document.getElementById("orb-custom-cursor")?.classList.add("clicking"));
  await locator.click({ delay: 60 });
  await page.evaluate(() => document.getElementById("orb-custom-cursor")?.classList.remove("clicking"));
  await sleep(200);
  await setCursor(page, "default");
}

async function typeSlow(page, locator, text) {
  await clickAt(page, locator);
  await setCursor(page, "default");
  await locator.fill("");
  await locator.type(text, { delay: 42 });
  await sleep(350);
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
    args: ["--disable-dev-shm-usage"],
  });
  const context = await browser.newContext({
    viewport: { width: 1600, height: 1000 },
    deviceScaleFactor: 2,
    locale: "uk-UA",
    recordVideo: { dir: tmpDir, size: { width: 1600, height: 1000 } },
  });
  const page = await context.newPage();
  t0 = Date.now();

  await page.goto(SITE, { waitUntil: "networkidle", timeout: 90000 });
  await installStudio(page);
  await titleCard(
    page,
    "Як подати заявку",
    "Короткий гайд по офіційному сайту 14 ОРБ",
    2600,
  );

  await caption(
    page,
    "1 · Відкрийте 14orb.co.ua",
    "Офіційний сайт батальйону — старт будь-якого звернення.",
  );
  await sleep(2200);

  await caption(
    page,
    "2 · Натисніть «Приєднатися»",
    "Кнопка на головному екрані відкриває форму для рекрутера.",
  );
  await sleep(900);
  const join = page.getByRole("link", { name: /Приєднатися до батальйону|Приєднатися/i }).first();
  await softZoom(page, join, 1100);
  await clickAt(page, join);
  await page.waitForURL(/\/join/, { timeout: 45000 });
  await page.waitForLoadState("networkidle");
  await installStudio(page);
  await sleep(800);

  await caption(
    page,
    "3 · Сторінка звернення",
    "Тут контакти рекрутера і форма заявки.",
  );
  await sleep(2000);

  const form = page.locator("form#form");
  await form.scrollIntoViewIfNeeded();
  await sleep(600);
  await caption(
    page,
    "4 · Заповніть ім'я та контакт",
    "Це обов'язкові поля — без них заявку не надіслати.",
  );
  await softZoom(page, form.locator("#name"), 900);
  await typeSlow(page, form.locator("#name"), "Іван Петренко");
  await softZoom(page, form.locator("#contact"), 900);
  await typeSlow(page, form.locator("#contact"), "+380 95 078 66 75");

  await caption(
    page,
    "5 · Додайте деталі (опційно)",
    "Досвід, напрям і коротке повідомлення — без чутливих даних.",
  );
  await softZoom(page, form.locator("#hasMilitaryExperience"), 800);
  await clickAt(page, form.locator("#hasMilitaryExperience"));
  await form.locator("#hasMilitaryExperience").selectOption("yes");
  await sleep(400);
  await softZoom(page, form.locator("#direction"), 800);
  await clickAt(page, form.locator("#direction"));
  try {
    await form.locator("#direction").selectOption({ label: "Інше / порадьте" });
  } catch {
    await form.locator("#direction").selectOption({ value: "Інше" });
  }
  await softZoom(page, form.locator("#message"), 700);
  await typeSlow(
    page,
    form.locator("#message"),
    "Цікавить служба в розвідці. Готовий до зв'язку в робочі години.",
  );

  await caption(
    page,
    "6 · Погодьте політику конфіденційності",
    "Обов'язкова згода на обробку даних для зв'язку з рекрутером.",
  );
  const privacy = form.locator('input[name="privacyAccepted"]');
  await softZoom(page, privacy, 900);
  await clickAt(page, privacy);

  await caption(
    page,
    "7 · Надішліть звернення",
    "Рекрутер відповість у робочі години. Можна також зателефонувати.",
  );
  const submit = form.getByRole("button", { name: /Надіслати звернення/i });
  await softZoom(page, submit, 1600);
  // do not submit real application
  await moveTo(page, submit);
  await sleep(1800);

  await titleCard(
    page,
    "Готово",
    "Заявку розглянуть і зв'яжуться з вами. Слава Україні!",
    2800,
  );

  const rawVideo = await page.video()?.path();
  await context.close();
  await browser.close();

  if (!rawVideo || !fs.existsSync(rawVideo)) throw new Error("No video recorded");

  const rawDest = path.join(docsDir, "yak-podaty-zayavku-raw.webm");
  const finalWebm = path.join(outDir, "yak-podaty-zayavku.webm");
  const finalMp4 = path.join(outDir, "yak-podaty-zayavku.mp4");
  fs.copyFileSync(rawVideo, rawDest);
  fs.copyFileSync(rawVideo, finalWebm);

  // Transcode to MP4 (H.264) via Playwright ffmpeg for wider playback
  if (fs.existsSync(FF)) {
    const { spawnSync } = await import("node:child_process");
    const r = spawnSync(
      FF,
      [
        "-y",
        "-i",
        rawDest,
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        "-an",
        finalMp4,
      ],
      { encoding: "utf8" },
    );
    if (r.status !== 0) {
      console.error(r.stderr?.slice(-800));
    }
  }

  const totalMs = nowMs();
  const project = {
    version: 1,
    videoPath: finalMp4 && fs.existsSync(finalMp4) ? finalMp4 : finalWebm,
    editor: {
      wallpaper: "/wallpapers/wallpaper1.jpg",
      shadowIntensity: 0.72,
      backgroundBlur: 0.2,
      zoomMotionBlur: 0.35,
      connectZooms: true,
      showCursor: true,
      loopCursor: false,
      cursorSize: 3.2,
      cursorSmoothing: 0.7,
      cursorMotionBlur: 0.35,
      cursorClickBounce: 2.5,
      borderRadius: 14,
      padding: 52,
      cropRegion: { x: 0, y: 0, width: 1, height: 1 },
      zoomRegions,
      trimRegions: [],
      speedRegions: [],
      annotationRegions: annotations,
      audioRegions: [],
      aspectRatio: "16:9",
      exportQuality: "high",
      exportFormat: "mp4",
      gifFrameRate: 30,
      gifLoop: true,
      gifSizePreset: "large",
    },
    meta: {
      title: "14 ОРБ — Як подати заявку",
      source: "recordly-inspired",
      totalMs,
      cursorTelemetry: telemetry,
      recordlyRepo: "https://github.com/DougNix/recordly",
    },
  };

  const projectPath = path.join(docsDir, "yak-podaty-zayavku.recordly");
  fs.writeFileSync(projectPath, JSON.stringify(project, null, 2));

  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {
    /* ignore */
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        webm: finalWebm,
        mp4: fs.existsSync(finalMp4) ? finalMp4 : null,
        project: projectPath,
        zooms: zoomRegions.length,
        telemetry: telemetry.length,
        bytes: fs.statSync(finalWebm).size,
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
