import { useState, useEffect, useRef, useCallback } from "react";
import { pernambucanize } from "../utils/pernambucanize";
import {
  chunkTextForSpeech,
  getSpeechProfile,
  pickBestVoice,
  shouldPreferServerAudio,
} from "../utils/speechStrategy";

const LANG = "pt-BR";

function cleanForSpeech(text: string, usePernambucanize: boolean): string {
  const base = text
    .replace(/[\u{1F300}-\u{1FFFF}]/gu, "")
    .replace(/[*_~`#]/g, "")
    .trim();
  return usePernambucanize ? pernambucanize(base) : base;
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const voicesRetryRef = useRef(false);
  const chunkSessionRef = useRef(0);
  const profileRef = useRef(getSpeechProfile());

  useEffect(() => {
    profileRef.current = getSpeechProfile();
    if (!window.speechSynthesis) return;
    setSupported(true);

    const load = () => {
      voiceRef.current = pickBestVoice(
        window.speechSynthesis.getVoices(),
        profileRef.current,
      );
    };

    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  const cancelPlayback = useCallback(() => {
    chunkSessionRef.current += 1;
    window.speechSynthesis?.cancel();
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    }
  }, []);

  const speakBrowserChunks = useCallback(
    (chunks: string[], sessionId: number, index: number) => {
      if (sessionId !== chunkSessionRef.current || !enabled || index >= chunks.length) {
        if (index >= chunks.length) onEnd?.();
        return;
      }

      const profile = profileRef.current;
      const voice =
        voiceRef.current ??
        pickBestVoice(window.speechSynthesis.getVoices(), profile);

      const utt = new SpeechSynthesisUtterance(chunks[index]);
      utt.lang = LANG;
      utt.rate = rate * profile.rateMultiplier;
      utt.pitch = profile.pitch;
      utt.volume = 1.0;
      if (voice) utt.voice = voice;

      if (index === 0) utt.onstart = () => onStart?.();

      utt.onend = () => {
        if (sessionId !== chunkSessionRef.current) return;
        const next = index + 1;
        if (next < chunks.length) {
          speakBrowserChunks(chunks, sessionId, next);
        } else {
          onEnd?.();
        }
      };
      utt.onerror = () => {
        if (sessionId === chunkSessionRef.current) onEnd?.();
      };

      window.speechSynthesis.speak(utt);
    },
    [enabled, rate, onStart, onEnd],
  );

  const speakBrowser = useCallback(
    (text: string) => {
      if (!supported || !enabled || !text) return;

      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0 && !voicesRetryRef.current) {
        voicesRetryRef.current = true;
        const retry = () => {
          window.speechSynthesis.removeEventListener("voiceschanged", retry);
          voiceRef.current = pickBestVoice(
            window.speechSynthesis.getVoices(),
            profileRef.current,
          );
          speakBrowser(text);
        };
        window.speechSynthesis.addEventListener("voiceschanged", retry);
        return;
      }

      const profile = profileRef.current;
      const clean = cleanForSpeech(text, profile.usePernambucanize);
      const chunks = profile.chunkLongText
        ? chunkTextForSpeech(clean, profile.chunkMaxChars)
        : [clean];

      window.speechSynthesis.cancel();
      const sessionId = ++chunkSessionRef.current;
      speakBrowserChunks(chunks, sessionId, 0);
    },
    [supported, enabled, speakBrowserChunks],
  );

  const speak = useCallback(
    (text: string, serverAudio?: string | null) => {
      if (!enabled || !text) return;

      cancelPlayback();

      const useServer =
        shouldPreferServerAudio() &&
        serverAudio &&
        serverAudio.startsWith("data:audio");

      if (useServer) {
        const audio = new Audio(serverAudio);
        audioRef.current = audio;
        audio.onplay = () => onStart?.();
        const finish = () => {
          if (audioRef.current === audio) audioRef.current = null;
          onEnd?.();
        };
        audio.onended = finish;
        audio.onerror = () => {
          finish();
          speakBrowser(text);
        };
        void audio.play().catch(() => {
          finish();
          speakBrowser(text);
        });
        return;
      }

      speakBrowser(text);
    },
    [enabled, cancelPlayback, speakBrowser, onStart, onEnd],
  );

  const stop = useCallback(() => {
    cancelPlayback();
    voicesRetryRef.current = false;
    onEnd?.();
  }, [cancelPlayback, onEnd]);

  return { speak, stop, supported };
}
