import axios from "axios";
import { useSettingsStore } from "./stores/user-settings";

const apiClient = axios.create({
    baseURL: "http://localhost:5224"
});

apiClient.interceptors.request.use((config: any) => {
  const backendUrl = useSettingsStore.getState().backendUrl;
  config.baseURL = backendUrl;
  return config;
});

apiClient.interceptors.request.use((config: any) => {
  const token = useSettingsStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default apiClient;
