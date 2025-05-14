import { create } from "zustand";

type Theme = "dark" | "light";

type Data = {
  backendUrl: string;
  accessToken?: string;
  theme: Theme;
};

type Actions = {
  actions: {
    setAccessToken: (token: string) => void;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
  };
};

export type UserSettingsStore = Data & Actions;

export const useSettingStore = create<UserSettingsStore>()((set, get) => ({
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5224",
  accessToken: undefined,
  theme: "dark",

  actions: {
    setAccessToken(token: string) {
      set({ accessToken: token });
    },
    toggleTheme() {
      const currentTheme = get().theme;
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      set({ theme: newTheme });
      document.documentElement.setAttribute("data-theme", newTheme);
    },
    setTheme(theme: Theme) {
      set({ theme });
      document.documentElement.setAttribute("data-theme", theme);
    },
  },
}));

export const useSettingActions = () =>
  useSettingStore((state) => state.actions);
