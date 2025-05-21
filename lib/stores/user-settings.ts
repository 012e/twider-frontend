import { create } from "zustand";
import { persist } from "zustand/middleware";

type Data = {
  backendUrl: string;
};

type Actions = {
  actions: {
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
      accessToken: null,
      theme: "dark",
      isLoggedIn: false,

      actions: {
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
