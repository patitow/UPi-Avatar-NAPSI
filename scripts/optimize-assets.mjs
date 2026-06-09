import { execFileSync } from "node:child_process";
import { renameSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegStatic from "ffmpeg-static";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const assetsDir = join(root, "public", "assets");

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function logChange(label, before, after) {
  const saved = before - after;
  const pct = before ? ((saved / before) * 100).toFixed(1) : "0.0";
  console.log(
    `[ok] ${label}: ${formatBytes(before)} -> ${formatBytes(after)} (-${pct}%)`,
  );
}

async function optimizeJpegs() {
  const files = [
    "avatar_idle.jpeg",
    "avatar_pensando.jpeg",
    "avatar_interagindo.jpeg",
  ];

  for (const file of files) {
    const input = join(assetsDir, file);
    const tmp = `${input}.tmp`;
    const before = statSync(input).size;

    await sharp(input)
      .resize({ width: 640, withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(tmp);

    renameSync(tmp, input);
    logChange(file, before, statSync(input).size);
  }
}

function optimizeMp4() {
  const input = join(assetsDir, "avatar_falando.mp4");
  const output = join(assetsDir, "avatar_falando.optimized.mp4");
  const before = statSync(input).size;

  if (!ffmpegStatic) {
    throw new Error("ffmpeg-static nao encontrado");
  }

  execFileSync(
    ffmpegStatic,
    [
      "-y",
      "-i",
      input,
      "-an",
      "-vcodec",
      "libx264",
      "-crf",
      "30",
      "-preset",
      "medium",
      "-movflags",
      "+faststart",
      "-vf",
      "scale=480:-2",
      output,
    ],
    { stdio: "inherit" },
  );

  renameSync(output, input);
  logChange("avatar_falando.mp4", before, statSync(input).size);
}

console.log("Otimizando assets em public/assets/ ...");
await optimizeJpegs();
optimizeMp4();
console.log("Concluido.");
