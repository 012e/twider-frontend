import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Theme = "dark" | "light";

type Data = {
  backendUrl: string;
  accessToken?: string;
  theme: Theme;
  isLoggedIn: boolean;
};

type Actions = {
  actions: {
    setAccessToken: (token: string) => void;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
  };
};

export type UserSettingsStore = Data & Actions;

function isObject(val: any): val is Record<string, any> {
  return val !== null && typeof val === "object" && !Array.isArray(val);
}

function merge(target: any, source: any): any {
  if (Array.isArray(source)) {
    return source.slice();
  }

  if (isObject(source)) {
    const result = { ...target };
    for (const key in source) {
      if (isObject(source[key]) && isObject(target?.[key])) {
        result[key] = merge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }

  return source;
}

export const useSettingStore = create<UserSettingsStore>()(
  persist(
    (set, get) => ({
      backendUrl:
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5224",
      accessToken: undefined,
      theme: "dark",
      isLoggedIn: false,

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
        setIsLoggedIn(isLoggedIn: boolean) {
          set({ isLoggedIn });
        }
      },
    }),
    {
      name: "setting-storage",
      version: 1,
      merge: (persistedState, currentState) => {
        return merge(currentState, persistedState);
      },
    },
  ),
);

export const useSettingActions = () =>
  useSettingStore((state) => state.actions);
