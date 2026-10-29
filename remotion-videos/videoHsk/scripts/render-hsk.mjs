import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionSource = readFileSync(path.join(projectRoot, "src", "data", "questions.ts"), "utf8");
const questionAudio = new Map(
  [...questionSource.matchAll(/id:\s*"(Q\d{2})"[\s\S]*?audio:\s*"([^"]+)"/g)].map(
    ([, id, audio]) => [id, audio],
  ),
);
const mode = process.argv[2];
const questionId = process.argv[3]?.toUpperCase();
const layoutArg = process.argv[4]?.toLowerCase();

if (!(["landscape", "vertical", "all", "one"].includes(mode))) {
  console.error("Dùng: node scripts/render-hsk.mjs landscape|vertical|all|one [Q01-Q99] [landscape|vertical]");
  process.exit(1);
}

if (mode === "one") {
  if (!/^Q\d{2}$/.test(questionId ?? "") || !["landscape", "vertical"].includes(layoutArg ?? "")) {
    console.error("Dùng: npm run render:hsk:one -- Q01 landscape (hoặc vertical); ID dạng Q01-Q99");
    process.exit(1);
  }
}

const questions = mode === "one"
  ? [questionId]
  : [...questionAudio.keys()];
const layouts = mode === "landscape" ? ["Landscape"] : mode === "vertical" ? ["Vertical"] : ["Landscape", "Vertical"];
const selectedLayouts = mode === "one" ? [layoutArg === "vertical" ? "Vertical" : "Landscape"] : layouts;
const missingQuestion = questions.filter((question) => !questionAudio.has(question));
if (missingQuestion.length > 0) {
  console.error(`Không tìm thấy dữ liệu câu hỏi: ${missingQuestion.join(", ")}`);
  process.exit(1);
}

const requiredAudio = questions.map((question) => questionAudio.get(question));
const missing = requiredAudio
  .filter((audio) => !existsSync(path.join(projectRoot, "public", audio)))
  .map((audio) => `public/${audio}`);

if (missing.length > 0) {
  console.error("Thiếu audio. Hãy chuẩn bị các file sau trước khi render:");
  for (const file of missing) {
    console.error(`  ${file}`);
  }
  process.exit(1);
}

const cliPath = path.join(projectRoot, "node_modules", "@remotion", "cli", "remotion-cli.js");

for (const id of questions.flatMap((question) => selectedLayouts.map((layout) => `HSK-${question}-${layout}`))) {
  const layout = id.endsWith("-Vertical") ? "vertical" : "landscape";
  const question = id.match(/Q\d{2}/)?.[0];
  const output = `out/${layout}/HSK-${question}.mp4`;
  console.log(`\nRendering ${id} -> ${output}`);

  const result = spawnSync(process.execPath, [cliPath, "render", id, output], {
    cwd: projectRoot,
    stdio: "inherit",
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
