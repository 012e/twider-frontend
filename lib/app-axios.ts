import axios from "axios";
import { useSettingStore } from "./stores/user-settings";

const apiClient = axios.create({
    baseURL: "http://localhost:5224"
});

apiClient.interceptors.request.use((config: any) => {
  const backendUrl = useSettingStore.getState().backendUrl;
  config.baseURL = backendUrl;
  return config;
});

apiClient.interceptors.request.use((config: any) => {
  const token = useSettingStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default apiClient;
