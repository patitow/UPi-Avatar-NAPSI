/**
 * Escolha de voz e parâmetros por plataforma (Chromium, Firefox, Safari, iOS, Android).
 * Prioridade global: áudio do servidor (gTTS) > Web Speech API com voz otimizada.
 */

export type SpeechPlatform =
  | "ios"
  | "android"
  | "desktop-chromium"
  | "desktop-firefox"
  | "desktop-safari"
  | "unknown";

export type SpeechProfile = {
  platform: SpeechPlatform;
  /** Vozes em nuvem (Edge/Chrome) costumam soar melhor que vozes só locais. */
  preferCloudVoices: boolean;
  /** Sotaque escrito (ucê, visse) atrapalha motores fracos — ex.: Safari iOS. */
  usePernambucanize: boolean;
  rateMultiplier: number;
  pitch: number;
  /** iOS corta frases longas; fragmentar no fallback do browser. */
  chunkLongText: boolean;
  chunkMaxChars: number;
};

export function detectSpeechPlatform(): SpeechPlatform {
  if (typeof navigator === "undefined") return "unknown";

  const ua = navigator.userAgent;
  const isIOS =
    /iPhone|iPad|iPod/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (isIOS) return "ios";
  if (/Android/i.test(ua)) return "android";
  if (/Firefox\//i.test(ua) && !/Seamonkey/i.test(ua)) return "desktop-firefox";
  if (/Edg\//i.test(ua) || /Chrome|Chromium|Brave|OPR\//i.test(ua)) {
    return "desktop-chromium";
  }
  if (/Safari/i.test(ua)) return "desktop-safari";
  return "unknown";
}

export function getSpeechProfile(platform = detectSpeechPlatform()): SpeechProfile {
  switch (platform) {
    case "ios":
      return {
        platform,
        preferCloudVoices: false,
        usePernambucanize: false,
        rateMultiplier: 0.92,
        pitch: 1,
        chunkLongText: true,
        chunkMaxChars: 180,
      };
    case "android":
      return {
        platform,
        preferCloudVoices: true,
        usePernambucanize: true,
        rateMultiplier: 0.88,
        pitch: 1.02,
        chunkLongText: true,
        chunkMaxChars: 220,
      };
    case "desktop-chromium":
      return {
        platform,
        preferCloudVoices: true,
        usePernambucanize: true,
        rateMultiplier: 0.86,
        pitch: 1.02,
        chunkLongText: false,
        chunkMaxChars: 400,
      };
    case "desktop-firefox":
      return {
        platform,
        preferCloudVoices: false,
        usePernambucanize: true,
        rateMultiplier: 0.9,
        pitch: 1,
        chunkLongText: false,
        chunkMaxChars: 400,
      };
    case "desktop-safari":
      return {
        platform,
        preferCloudVoices: false,
        usePernambucanize: false,
        rateMultiplier: 0.9,
        pitch: 1,
        chunkLongText: true,
        chunkMaxChars: 200,
      };
    default:
      return {
        platform: "unknown",
        preferCloudVoices: true,
        usePernambucanize: true,
        rateMultiplier: 0.88,
        pitch: 1.02,
        chunkLongText: false,
        chunkMaxChars: 300,
      };
  }
}

function voiceScore(voice: SpeechSynthesisVoice, profile: SpeechProfile): number {
  const name = voice.name;
  const lang = voice.lang;
  let score = 0;

  if (lang === "pt-BR") score += 40;
  else if (lang.startsWith("pt")) score += 20;

  if (profile.preferCloudVoices && !voice.localService) score += 25;

  if (profile.platform === "ios") {
    if (/luciana|joana|maria|helena|portugu[eê]s.*brasil/i.test(name)) score += 30;
    if (voice.default) score += 10;
  } else if (profile.platform === "android") {
    if (/google.*portugu[eê]s.*(brasil|brazil)/i.test(name)) score += 35;
    if (/pt-br-x-.*-network/i.test(name)) score += 28;
  } else if (profile.platform === "desktop-chromium") {
    if (/\bflo\b/i.test(name)) score += 32;
    if (/google.*portugu[eê]s.*brasil/i.test(name)) score += 30;
    if (/microsoft.*(luciana|maria|francisca).*online/i.test(name)) score += 28;
    if (/natural|neural|online/i.test(name) && !voice.localService) score += 18;
  } else if (profile.platform === "desktop-firefox") {
    if (/maria|luciana|portugu[eê]s/i.test(name)) score += 22;
  } else {
    if (/\bflo\b/i.test(name)) score += 28;
    if (/luciana|maria|francisca|shelley/i.test(name)) score += 20;
    if (/google.*portugu[eê]s.*brasil/i.test(name)) score += 24;
    if (/microsoft.*portugu[eê]s/i.test(name)) score += 18;
  }

  if (voice.default && lang.startsWith("pt")) score += 5;
  return score;
}

export function pickBestVoice(
  voices: SpeechSynthesisVoice[],
  profile = getSpeechProfile(),
): SpeechSynthesisVoice | null {
  if (!voices.length) return null;

  const pt = voices.filter((v) => v.lang.startsWith("pt"));
  const pool = pt.length ? pt : voices;

  return pool.reduce<SpeechSynthesisVoice | null>((best, v) => {
    if (!best) return v;
    return voiceScore(v, profile) > voiceScore(best, profile) ? v : best;
  }, null);
}

/** Fragmenta texto para motores que truncam (Safari/iOS). */
export function chunkTextForSpeech(text: string, maxChars: number): string[] {
  const trimmed = text.trim();
  if (trimmed.length <= maxChars) return [trimmed];

  const sentences = trimmed.match(/[^.!?…]+[.!?…]?/g) ?? [trimmed];
  const chunks: string[] = [];
  let buf = "";

  for (const sentence of sentences) {
    const part = sentence.trim();
    if (!part) continue;
    if (`${buf} ${part}`.trim().length <= maxChars) {
      buf = buf ? `${buf} ${part}` : part;
    } else {
      if (buf) chunks.push(buf);
      if (part.length > maxChars) {
        for (let i = 0; i < part.length; i += maxChars) {
          chunks.push(part.slice(i, i + maxChars));
        }
        buf = "";
      } else {
        buf = part;
      }
    }
  }
  if (buf) chunks.push(buf);
  return chunks.length ? chunks : [trimmed];
}

export function shouldPreferServerAudio(): boolean {
  return typeof Audio !== "undefined";
}
