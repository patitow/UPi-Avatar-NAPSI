import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type MutableRefObject,
} from "react";
import {
  loadA11yPreferences,
  saveA11yPreferences,
  type A11yPreferences,
  type FontSize,
} from "../utils/a11yStorage";

export type { FontSize };

export type AccessibilityApi = {
  highContrast: boolean;
  setHighContrast: (value: boolean | ((prev: boolean) => boolean)) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (value: boolean | ((prev: boolean) => boolean)) => void;
  voiceSpeed: number;
  setVoiceSpeed: (speed: number) => void;
  statusAnnouncement: string;
  errorAnnouncement: string;
  announceStatus: (msg: string) => void;
  announceError: (msg: string) => void;
  showSettings: boolean;
  setShowSettings: (open: boolean) => void;
  showInfo: boolean;
  setShowInfo: (open: boolean) => void;
  openSettings: (trigger?: HTMLElement | null) => void;
  openInfo: (trigger?: HTMLElement | null) => void;
  closeSettings: () => void;
  closeInfo: () => void;
  settingsTriggerRef: MutableRefObject<HTMLElement | null>;
  infoTriggerRef: MutableRefObject<HTMLElement | null>;
};

function systemPrefersHighContrast(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-contrast: more)").matches
  );
}

export function useAccessibility(): AccessibilityApi {
  const initial = loadA11yPreferences();
  const prefersHc = systemPrefersHighContrast();

  const [highContrastManual, setHighContrastManual] = useState(
    initial.highContrastManual,
  );
  const [highContrast, setHighContrastState] = useState(
    initial.highContrastManual
      ? initial.highContrast
      : initial.highContrast || prefersHc,
  );
  const [fontSize, setFontSizeState] = useState<FontSize>(initial.fontSize);
  const [voiceEnabled, setVoiceEnabledState] = useState(initial.voiceEnabled);
  const [voiceSpeed, setVoiceSpeedState] = useState(initial.voiceSpeed);
  const [statusAnnouncement, setStatusAnnouncement] = useState("");
  const [errorAnnouncement, setErrorAnnouncement] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const settingsTriggerRef = useRef<HTMLElement | null>(null);
  const infoTriggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    saveA11yPreferences({
      highContrast,
      highContrastManual,
      fontSize,
      voiceEnabled,
      voiceSpeed,
    });
  }, [highContrast, highContrastManual, fontSize, voiceEnabled, voiceSpeed]);

  const setHighContrast = useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      setHighContrastManual(true);
      setHighContrastState(value);
    },
    [],
  );

  const setFontSize = useCallback((size: FontSize) => {
    setFontSizeState(size);
  }, []);

  const setVoiceEnabled = useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      setVoiceEnabledState(value);
    },
    [],
  );

  const setVoiceSpeed = useCallback((speed: number) => {
    setVoiceSpeedState(Math.min(2, Math.max(0.5, speed)));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", highContrast);
    return () => document.documentElement.classList.remove("high-contrast");
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.classList.remove(
      "font-large",
      "font-extra-large",
    );
    if (fontSize === "large") {
      document.documentElement.classList.add("font-large");
    } else if (fontSize === "extra-large") {
      document.documentElement.classList.add("font-extra-large");
    }
  }, [fontSize]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-contrast: more)");
    const apply = () => {
      if (highContrastManual) return;
      setHighContrastState(mq.matches);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [highContrastManual]);

  useEffect(() => {
    if (!statusAnnouncement) return;
    const t = setTimeout(() => setStatusAnnouncement(""), 2500);
    return () => clearTimeout(t);
  }, [statusAnnouncement]);

  useEffect(() => {
    if (!errorAnnouncement) return;
    const t = setTimeout(() => setErrorAnnouncement(""), 3500);
    return () => clearTimeout(t);
  }, [errorAnnouncement]);

  const announceStatus = useCallback((msg: string) => {
    setStatusAnnouncement(msg);
  }, []);

  const announceError = useCallback((msg: string) => {
    setErrorAnnouncement(msg);
  }, []);

  const openSettings = useCallback((trigger?: HTMLElement | null) => {
    if (trigger) settingsTriggerRef.current = trigger;
    setShowSettings(true);
  }, []);

  const openInfo = useCallback((trigger?: HTMLElement | null) => {
    if (trigger) infoTriggerRef.current = trigger;
    setShowInfo(true);
  }, []);

  const closeSettings = useCallback(() => {
    setShowSettings(false);
    settingsTriggerRef.current?.focus?.();
  }, []);

  const closeInfo = useCallback(() => {
    setShowInfo(false);
    infoTriggerRef.current?.focus?.();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey) return;
      switch (e.code) {
        case "KeyC":
          e.preventDefault();
          setHighContrast((prev) => {
            const next = !prev;
            setStatusAnnouncement(
              next ? "Alto contraste ativado" : "Alto contraste desativado",
            );
            return next;
          });
          break;
        case "KeyA":
          e.preventDefault();
          openSettings();
          break;
        case "KeyI":
          e.preventDefault();
          openInfo();
          break;
        case "KeyS": {
          e.preventDefault();
          const input = document.getElementById("main-chat-input");
          if (input instanceof HTMLElement) input.focus();
          break;
        }
        case "KeyM": {
          e.preventDefault();
          const region = document.getElementById("chat-messages");
          if (region instanceof HTMLElement) region.focus();
          break;
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setHighContrast, openSettings, openInfo]);

  return {
    highContrast,
    setHighContrast,
    fontSize,
    setFontSize,
    voiceEnabled,
    setVoiceEnabled,
    voiceSpeed,
    setVoiceSpeed,
    statusAnnouncement,
    errorAnnouncement,
    announceStatus,
    announceError,
    showSettings,
    setShowSettings,
    showInfo,
    setShowInfo,
    openSettings,
    openInfo,
    closeSettings,
    closeInfo,
    settingsTriggerRef,
    infoTriggerRef,
  };
}
