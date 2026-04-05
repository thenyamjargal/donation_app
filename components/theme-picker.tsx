"use client"

export const THEMES = [
  { id: "stone", name: "Хар", primary: "#1c1917", secondary: "#292524", accent: "#f59e0b" },
  { id: "rose", name: "Ягаан улаан", primary: "#be123c", secondary: "#e11d48", accent: "#fda4af" },
  { id: "blue", name: "Цэнхэр", primary: "#1d4ed8", secondary: "#2563eb", accent: "#93c5fd" },
  { id: "emerald", name: "Ногоон", primary: "#059669", secondary: "#10b981", accent: "#6ee7b7" },
  { id: "violet", name: "Нил ягаан", primary: "#7c3aed", secondary: "#8b5cf6", accent: "#c4b5fd" },
  { id: "orange", name: "Улбар шар", primary: "#ea580c", secondary: "#f97316", accent: "#fdba74" },
  { id: "cyan", name: "Усан цэнхэр", primary: "#0891b2", secondary: "#06b6d4", accent: "#67e8f9" },
  { id: "pink", name: "Ягаан туяа", primary: "#db2777", secondary: "#ec4899", accent: "#f9a8d4" },
  { id: "amber", name: "Алтлаг", primary: "#d97706", secondary: "#f59e0b", accent: "#fcd34d" },
  { id: "teal", name: "Хөх ногоон", primary: "#0d9488", secondary: "#14b8a6", accent: "#5eead4" },
  { id: "indigo", name: "Хөх ягаан", primary: "#4f46e5", secondary: "#6366f1", accent: "#a5b4fc" },
  { id: "red", name: "Улаан", primary: "#dc2626", secondary: "#ef4444", accent: "#fca5a5" },
  { id: "lime", name: "Лайм", primary: "#65a30d", secondary: "#84cc16", accent: "#bef264" },
  { id: "fuchsia", name: "Фуксиа", primary: "#c026d3", secondary: "#d946ef", accent: "#f0abfc" },
  { id: "sky", name: "Тэнгэр", primary: "#0284c7", secondary: "#0ea5e9", accent: "#7dd3fc" },
  { id: "slate", name: "Саарал", primary: "#475569", secondary: "#64748b", accent: "#cbd5e1" },
]

const ENV_THEME_ID = process.env.NEXT_PUBLIC_THEME || "stone"
const ENV_THEME = THEMES.find(t => t.id === ENV_THEME_ID) || THEMES[0]

export function useTheme() {
  return ENV_THEME
}
