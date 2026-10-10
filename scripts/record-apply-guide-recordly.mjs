/**
 * Scripted apply-guide video (Recordly-style zooms + studio framing).
 * Storyboard from product owner.
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
      html, body { background: #07090c !important; }
      * { cursor: none !important; }
      #orb-custom-cursor {
        position: fixed; z-index: 2147483646; pointer-events: none;
        width: 34px; height: 34px; transform: translate(-3px, -1px);
        filter: drop-shadow(0 8px 14px rgba(0,0,0,.4));
        transition: transform 70ms ease-out;
      }
      #orb-custom-cursor.clicking { transform: translate(-3px, -1px) scale(.86); }
      #orb-title-card {
        position: fixed; inset: 0; z-index: 2147483647;
        display: flex; align-items: center; justify-content: center;
        background: #07090c; color: #fff;
        font-family: "SF Pro Display", "Segoe UI", system-ui, sans-serif;
        pointer-events: none; opacity: 0;
        transition: opacity .7s ease;
      }
      #orb-title-card.show { opacity: 1; }
      #orb-zoom-root {
        transition: transform .7s cubic-bezier(.22, 1, .36, 1);
        transform-origin: center center;
        will-change: transform;
      }
    `,
  });

  await page.evaluate(
    ({ cursorDefault, cursorPointer }) => {
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

async function titleCard(page, { title, subtitle = "", showMs = 2800, fadeOut = true }) {
  await page.evaluate(
    ({ title, subtitle }) => {
      const el = document.getElementById("orb-title-card");
      if (!el) return;
      el.innerHTML = `<div style="text-align:center;padding:48px;max-width:920px">
        <div style="font-size:clamp(2rem,4.2vw,3.25rem);font-weight:650;letter-spacing:-.03em;line-height:1.2">${title}</div>
        ${subtitle ? `<div style="margin-top:22px;font-size:clamp(1.05rem,2vw,1.25rem);opacity:.72;line-height:1.5">${subtitle}</div>` : ""}
      </div>`;
      el.classList.add("show");
    },
    { title, subtitle },
  );
  await sleep(showMs);
  if (fadeOut) {
    await page.evaluate(() => document.getElementById("orb-title-card")?.classList.remove("show"));
    await sleep(750);
  }
}

async function softZoom(page, locator, { scale = 1.55, holdMs = 1400 } = {}) {
  const box = await locator.boundingBox();
  if (!box) return null;
  const vp = page.viewportSize();
  const cx = (box.x + box.width / 2) / vp.width;
  const cy = (box.y + box.height / 2) / vp.height;
  pushZoom({ cx, cy }, holdMs, 4);
  await page.evaluate(
    ({ cx, cy, scale }) => {
      const root = document.getElementById("orb-zoom-root") || document.body;
      root.style.transformOrigin = `${cx * 100}% ${cy * 100}%`;
      root.style.transform = `scale(${scale})`;
    },
    { cx, cy, scale },
  );
  await sleep(holdMs);
  return { cx, cy };
}

async function zoomOut(page) {
  await page.evaluate(() => {
    const root = document.getElementById("orb-zoom-root") || document.body;
    root.style.transform = "scale(1)";
  });
  await sleep(700);
}

async function centerOf(locator) {
  const box = await locator.boundingBox();
  if (!box) return null;
  return { x: box.x + box.width / 2, y: box.y + box.height / 2, box };
}

async function moveToPoint(page, x, y, steps = 36) {
  await setCursor(page, "pointer");
  await page.mouse.move(x, y, { steps });
  const vp = page.viewportSize();
  telemetry.push({
    timeMs: nowMs(),
    cx: x / vp.width,
    cy: y / vp.height,
    interactionType: "move",
    cursorType: "pointer",
  });
  await sleep(220);
}

async function clickPoint(page, x, y) {
  await moveToPoint(page, x, y);
  const vp = page.viewportSize();
  telemetry.push({
    timeMs: nowMs(),
    cx: x / vp.width,
    cy: y / vp.height,
    interactionType: "click",
    cursorType: "pointer",
  });
  await page.evaluate(() => document.getElementById("orb-custom-cursor")?.classList.add("clicking"));
  // mouse.click ignores CSS transform viewport issues from soft-zoom
  await page.mouse.click(x, y, { delay: 70 });
  await page.evaluate(() => document.getElementById("orb-custom-cursor")?.classList.remove("clicking"));
  await sleep(250);
  await setCursor(page, "default");
}

async function clickAt(page, locator) {
  const pt = await centerOf(locator);
  if (!pt) return;
  await moveToPoint(page, pt.x, pt.y);
  const vp = page.viewportSize();
  telemetry.push({
    timeMs: nowMs(),
    cx: pt.x / vp.width,
    cy: pt.y / vp.height,
    interactionType: "click",
    cursorType: "pointer",
  });
  await page.evaluate(() => document.getElementById("orb-custom-cursor")?.classList.add("clicking"));
  // DOM click bypasses CSS-transform viewport checks from soft-zoom
  await locator.evaluate((el) => {
    el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
    if (typeof el.click === "function") el.click();
  });
  await sleep(80);
  await page.evaluate(() => document.getElementById("orb-custom-cursor")?.classList.remove("clicking"));
  await sleep(250);
  await setCursor(page, "default");
}

async function typeSlow(page, locator, text) {
  await clickAt(page, locator);
  await locator.focus();
  await locator.fill("");
  await locator.type(text, { delay: 48 });
  await sleep(420);
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

  // Fake successful submit so we don't spam production with demo applications.
  await page.route("**/api/applications", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
      return;
    }
    await route.continue();
  });

  t0 = Date.now();

  // Pure black opener first (before site paint)
  await page.setContent(`<!doctype html><html><body style="margin:0;background:#07090c"></body></html>`);
  await installStudio(page);
  await titleCard(page, {
    title: "Як подати звернення на куратора?",
    showMs: 3200,
    fadeOut: true,
  });

  // Smooth transition onto the site
  await page.goto(SITE, { waitUntil: "networkidle", timeout: 90000 });
  await installStudio(page);
  await sleep(1200);

  // Zoom top-right «Приєднатися» (header CTA button preferred)
  const joinHeader = page
    .locator("header")
    .getByRole("link", { name: /^Приєднатися$/i })
    .last();
  await joinHeader.waitFor({ state: "visible", timeout: 15000 });
  await softZoom(page, joinHeader, { scale: 1.9, holdMs: 1700 });
  await clickAt(page, joinHeader);
  try {
    await page.waitForURL(/\/join/, { timeout: 5000 });
  } catch {
    await page.goto(`${SITE}/join`, { waitUntil: "networkidle", timeout: 60000 });
  }
  await page.waitForLoadState("networkidle");
  await installStudio(page);
  await zoomOut(page);
  await sleep(900);

  // Show full join page
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  await sleep(1600);

  // Zoom form zone and fill gradually
  const form = page.locator("form#form");
  await form.scrollIntoViewIfNeeded();
  await sleep(700);
  await softZoom(page, form, { scale: 1.28, holdMs: 1100 });

  await softZoom(page, form.locator("#name"), { scale: 1.45, holdMs: 700 });
  await typeSlow(page, form.locator("#name"), "Іван Петренко");

  await softZoom(page, form.locator("#contact"), { scale: 1.45, holdMs: 700 });
  await typeSlow(page, form.locator("#contact"), "+380 95 078 66 75");

  await softZoom(page, form.locator("#hasMilitaryExperience"), { scale: 1.4, holdMs: 650 });
  await clickAt(page, form.locator("#hasMilitaryExperience"));
  await form.locator("#hasMilitaryExperience").selectOption("yes");
  await sleep(350);

  await softZoom(page, form.locator("#direction"), { scale: 1.4, holdMs: 650 });
  await clickAt(page, form.locator("#direction"));
  try {
    await form.locator("#direction").selectOption({ label: "Інше / порадьте" });
  } catch {
    await form.locator("#direction").selectOption({ value: "Інше" });
  }
  await sleep(350);

  await softZoom(page, form.locator("#message"), { scale: 1.35, holdMs: 650 });
  await typeSlow(
    page,
    form.locator("#message"),
    "Хочу долучитися до підрозділу. Готовий до зв'язку з куратором.",
  );

  const privacy = form.locator('input[name="privacyAccepted"]');
  await softZoom(page, privacy, { scale: 1.5, holdMs: 800 });
  await clickAt(page, privacy);
  await sleep(400);

  // Submit
  const submit = form.getByRole("button", { name: /Надіслати звернення/i });
  await softZoom(page, submit, { scale: 1.6, holdMs: 1100 });
  await clickAt(page, submit);
  await sleep(1200);

  // Closing black card
  await titleCard(page, {
    title: "Вашу заявку розглянуть протягом дня.",
    subtitle: "Дякуємо",
    showMs: 3800,
    fadeOut: false,
  });
  await sleep(400);

  const rawVideo = await page.video()?.path();
  await context.close();
  await browser.close();

  if (!rawVideo || !fs.existsSync(rawVideo)) throw new Error("No video recorded");

  const finalWebm = path.join(outDir, "yak-podaty-zayavku.webm");
  const rawDest = path.join(docsDir, "yak-podaty-zayavku-raw.webm");
  fs.copyFileSync(rawVideo, rawDest);
  fs.copyFileSync(rawVideo, finalWebm);

  const projectPath = path.join(docsDir, "yak-podaty-zayavku.recordly");
  fs.writeFileSync(
    projectPath,
    JSON.stringify(
      {
        version: 1,
        videoPath: finalWebm,
        editor: {
          wallpaper: "/wallpapers/wallpaper1.jpg",
          shadowIntensity: 0.7,
          backgroundBlur: 0.15,
          zoomMotionBlur: 0.35,
          connectZooms: true,
          showCursor: true,
          loopCursor: false,
          cursorSize: 3.1,
          cursorSmoothing: 0.72,
          cursorMotionBlur: 0.35,
          cursorClickBounce: 2.4,
          borderRadius: 12,
          padding: 48,
          cropRegion: { x: 0, y: 0, width: 1, height: 1 },
          zoomRegions,
          trimRegions: [],
          speedRegions: [],
          annotationRegions: [],
          audioRegions: [],
          aspectRatio: "16:9",
          exportQuality: "high",
          exportFormat: "mp4",
          gifFrameRate: 30,
          gifLoop: true,
          gifSizePreset: "large",
        },
        meta: {
          title: "Як подати звернення на куратора?",
          totalMs: nowMs(),
          cursorTelemetry: telemetry,
          recordlyRepo: "https://github.com/DougNix/recordly",
        },
      },
      null,
      2,
    ),
  );

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
        project: projectPath,
        zooms: zoomRegions.length,
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
