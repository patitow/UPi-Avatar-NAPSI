export type FontSize = "normal" | "large" | "extra-large";

export interface A11yPreferences {
  highContrast: boolean;
  highContrastManual: boolean;
  fontSize: FontSize;
  voiceEnabled: boolean;
  voiceSpeed: number;
}

const STORAGE_KEY = "upi-a11y-preferences";

const DEFAULTS: A11yPreferences = {
  highContrast: false,
  highContrastManual: false,
  fontSize: "normal",
  voiceEnabled: true,
  voiceSpeed: 1,
};

export function loadA11yPreferences(): A11yPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw) as Partial<A11yPreferences>;
    return {
      highContrast: Boolean(parsed.highContrast),
      highContrastManual: Boolean(parsed.highContrastManual),
      fontSize:
        parsed.fontSize === "large" || parsed.fontSize === "extra-large"
          ? parsed.fontSize
          : "normal",
      voiceEnabled: parsed.voiceEnabled !== false,
      voiceSpeed:
        typeof parsed.voiceSpeed === "number"
          ? Math.min(2, Math.max(0.5, parsed.voiceSpeed))
          : 1,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveA11yPreferences(prefs: A11yPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* quota / modo privado */
  }
}

export const SESSION_KEY = "upi-session-active";

export function isSessionActive(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function setSessionActive(active: boolean): void {
  try {
    if (active) sessionStorage.setItem(SESSION_KEY, "1");
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}
