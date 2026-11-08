export const THEMES = ["midnight", "deep-space"] as const;
export type Theme = (typeof THEMES)[number];

const STORAGE_KEY = "theme";

export function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return THEMES.find((t) => t === stored) ?? "midnight";
  } catch {
    return "midnight";
  }
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // storage unavailable (private mode); the theme still applies for this visit
  }
}

export const nextTheme = (theme: Theme): Theme => (theme === "midnight" ? "deep-space" : "midnight");
