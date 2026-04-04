export type Theme = "light" | "dark";

export const getTheme = (): Theme => (localStorage.getItem("theme") as Theme) || "light";

export const applyTheme = (theme: Theme) => {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
};