import { useState, useEffect, useRef, useCallback } from "react";
import { pernambucanize } from "../utils/pernambucanize";

const LANG = "pt-BR";

function pickVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const ptBR = voices.filter((v) => v.lang === "pt-BR");
  const preferred =
    ptBR.find((v) => /\bflo\b/i.test(v.name)) ??
    ptBR.find((v) => /luciana|sandy|shelley/i.test(v.name)) ??
    ptBR[0] ??
    voices.find((v) => v.lang.startsWith("pt")) ??
    null;
  return preferred;
}

function cleanForSpeech(text: string): string {
  return pernambucanize(
    text
      .replace(/[\u{1F300}-\u{1FFFF}]/gu, "")
      .replace(/[*_~`#]/g, "")
      .trim(),
  );
}

interface UseSpeechOptions {
  enabled: boolean;
  rate?: number;
  onStart?: () => void;
  onEnd?: () => void;
}

export function useSpeech({
  enabled,
  rate = 0.84,
  onStart,
  onEnd,
}: UseSpeechOptions) {
  const [supported, setSupported] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (!window.speechSynthesis) return;
    setSupported(true);

    const load = () => {
      voiceRef.current = pickVoice(window.speechSynthesis.getVoices());
    };

    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!supported || !enabled || !text) return;

      window.speechSynthesis.cancel();
      const clean = cleanForSpeech(text);
      const voice =
        voiceRef.current ??
        pickVoice(window.speechSynthesis.getVoices());

      const utt = new SpeechSynthesisUtterance(clean);
      utt.lang = LANG;
      utt.rate = rate;
      utt.pitch = 1.08;
      utt.volume = 1.0;
      if (voice) utt.voice = voice;

      utt.onstart = () => onStart?.();
      utt.onend = () => onEnd?.();
      utt.onerror = () => onEnd?.();

      window.speechSynthesis.speak(utt);
    },
    [supported, enabled, rate, onStart, onEnd],
  );

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    onEnd?.();
  }, [onEnd]);

  return { speak, stop, supported };
}
