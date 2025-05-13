import { create } from "zustand";

type Data = {
  backendUrl: string;
  accessToken?: string;
};

type Actions = {
  actions: {
    setAccessToken: (token: string) => void;
  };
};

export type UserSettingsStore = Data & Actions;

export const useSettingsStore = create<UserSettingsStore>()((set, get) => ({
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080",
  accessToken: undefined,
  actions: {
    setAccessToken: (token: string) => {
      set({ accessToken: token });
    },
  },
}));

export const useSettingsStoreActions = () =>
  useSettingsStore((state) => state.actions);
