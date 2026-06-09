import { execFileSync } from "node:child_process";
import { renameSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegStatic from "ffmpeg-static";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const assetsDir = join(root, "public", "assets");

/** Preset equilibrado: boa qualidade visual sem voltar aos MBs originais. */
const PRESET = {
  jpeg: { maxWidth: 960, quality: 92 },
  mp4: { crf: 23, scale: 960, preset: "slow" },
};

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function logChange(label, before, after) {
  const saved = before - after;
  const pct = before ? ((saved / before) * 100).toFixed(1) : "0.0";
  const sign = saved >= 0 ? "-" : "+";
  console.log(
    `[ok] ${label}: ${formatBytes(before)} -> ${formatBytes(after)} (${sign}${Math.abs(pct)}%)`,
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
      .resize({ width: PRESET.jpeg.maxWidth, withoutEnlargement: true })
      .jpeg({ quality: PRESET.jpeg.quality, mozjpeg: true })
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
      String(PRESET.mp4.crf),
      "-preset",
      PRESET.mp4.preset,
      "-movflags",
      "+faststart",
      "-pix_fmt",
      "yuv420p",
      "-vf",
      `scale=${PRESET.mp4.scale}:-2`,
      output,
    ],
    { stdio: "inherit" },
  );

  renameSync(output, input);
  logChange("avatar_falando.mp4", before, statSync(input).size);
}

console.log(
  `Otimizando assets (preset equilibrado: jpeg q${PRESET.jpeg.quality}, mp4 crf${PRESET.mp4.crf} @${PRESET.mp4.scale}px) ...`,
);
await optimizeJpegs();
optimizeMp4();
console.log("Concluido.");
