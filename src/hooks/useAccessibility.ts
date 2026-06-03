import { useState, useEffect, useCallback } from "react";

export type FontSize = "normal" | "large" | "extra-large";

export function useAccessibility() {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>("normal");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceSpeed, setVoiceSpeed] = useState(1);
  const [statusAnnouncement, setStatusAnnouncement] = useState("");
  const [errorAnnouncement, setErrorAnnouncement] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

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
    if (!statusAnnouncement) return;
    const t = setTimeout(() => setStatusAnnouncement(""), 1500);
    return () => clearTimeout(t);
  }, [statusAnnouncement]);

  useEffect(() => {
    if (!errorAnnouncement) return;
    const t = setTimeout(() => setErrorAnnouncement(""), 2000);
    return () => clearTimeout(t);
  }, [errorAnnouncement]);

  const announceStatus = useCallback((msg: string) => {
    setStatusAnnouncement(msg);
  }, []);

  const announceError = useCallback((msg: string) => {
    setErrorAnnouncement(msg);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey) return;
      switch (e.code) {
        case "KeyC":
          e.preventDefault();
          setHighContrast((prev) => {
            setStatusAnnouncement(
              prev ? "Alto contraste desativado" : "Alto contraste ativado",
            );
            return !prev;
          });
          break;
        case "KeyA":
          e.preventDefault();
          setShowSettings(true);
          break;
        case "KeyI":
          e.preventDefault();
          setShowInfo(true);
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
  }, []);

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
  };
}
