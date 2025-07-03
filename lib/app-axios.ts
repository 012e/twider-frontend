import axios from "axios";
import { useSettingStore } from "./stores/user-settings";
import { getSession } from "next-auth/react";

const apiClient = axios.create({
  baseURL: "http://localhost:5224",
});

apiClient.interceptors.request.use((config: any) => {
  const backendUrl = useSettingStore.getState().backendUrl;
  config.baseURL = backendUrl;
  return config;
});

apiClient.interceptors.request.use(async (config: any) => {
  if (!!config.headers.Authorization) {
    return config;
  }

  // FUCK nextjs
  const session = await getSession() as any;
  if (session) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }

  return config;
});

// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.log("Unauthorized");
//     }
//     return Promise.reject(error);
//   },
// );

export default apiClient;
