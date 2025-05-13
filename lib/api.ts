import { createClient } from "@hey-api/client-axios";
import { useSettingsStore } from "./stores/user-settings";

const apiClient = createClient({
  baseURL: "http://localhost:5224"
});

apiClient.instance.interceptors.request.use((config) => {
  const backendUrl = useSettingsStore.getState().backendUrl;
  config.baseURL = backendUrl;
  return config;
});

apiClient.instance.interceptors.request.use((config) => {
  const token = useSettingsStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default apiClient;
