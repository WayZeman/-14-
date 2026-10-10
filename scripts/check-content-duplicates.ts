/**
 * Звіт про повтори користувацьких текстів у src/.
 * Запуск: npm run content:check
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SCAN = path.join(ROOT, "src");

const ALLOWLIST = new Set([
  "14 ОРБ",
  "14-й окремий розвідувальний батальйон",
  "Дій першим",
  "Приєднатися",
  "Підтримка",
  "Новини",
  "Вакансії",
  "Хто ми",
  "Контакти",
  "Деталі — після звернення до рекрутера.",
  "Звернення надіслано. Очікуйте відповідь у робочі години рекрутингу.",
]);

function walk(dir: string, acc: string[] = []): string[] {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === "node_modules" || ent.name === ".next") continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (/\.(tsx|ts)$/.test(ent.name) && !p.includes("schema.ts")) acc.push(p);
  }
  return acc;
}

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isProse(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 28) return false;
  if (/^(https?:|\/|@|#|\$\{|import |export |from |className|var\(--|use[A-Z])/.test(trimmed))
    return false;
  if (/[{}<>;=]/.test(trimmed)) return false;
  if (/\b(px-|py-|md:|lg:|flex|grid|border|rounded|text-\[)/.test(trimmed)) return false;

  const cyrillic = (trimmed.match(/\p{Script=Cyrillic}/gu) || []).length;
  if (cyrillic < 12) return false;
  return cyrillic / trimmed.length >= 0.35;
}

function extractStrings(file: string): { file: string; text: string }[] {
  const content = fs.readFileSync(file, "utf8");
  const out: { file: string; text: string }[] = [];
  const re = /["'`]([^"'`\\]{28,})["'`]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content))) {
    const text = m[1].replace(/\\n/g, " ").trim();
    if (!isProse(text)) continue;
    out.push({ file: path.relative(ROOT, file), text });
  }
  return out;
}

const files = walk(SCAN);
const all = files.flatMap(extractStrings);
const byNorm = new Map<string, { file: string; text: string }[]>();

for (const item of all) {
  const n = norm(item.text);
  if (ALLOWLIST.has(item.text.trim())) continue;
  if (!byNorm.has(n)) byNorm.set(n, []);
  byNorm.get(n)!.push(item);
}

const dupes = [...byNorm.entries()]
  .filter(([, v]) => v.length > 1)
  .sort((a, b) => b[1].length - a[1].length);

let exitCode = 0;
console.log(`Scanned ${all.length} prose strings in ${files.length} files`);
console.log(`Duplicate prose groups: ${dupes.length}\n`);

for (const [, items] of dupes) {
  const uniqueFiles = [...new Set(items.map((i) => i.file))];
  if (uniqueFiles.length < 2) continue;
  console.log(`— ${items[0].text.slice(0, 120)}${items[0].text.length > 120 ? "…" : ""}`);
  for (const f of uniqueFiles) console.log(`    ${f}`);
  exitCode = 1;
}

if (exitCode === 0) console.log("No cross-file duplicate prose detected (allowlist applied).");
process.exit(exitCode);
