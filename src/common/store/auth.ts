import axios from "axios";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const axiosInstance = axios.create({
  withCredentials: true,
});

if (import.meta.env.MODE === "production") {
  axiosInstance.defaults.baseURL = import.meta.env.VITE_API_URL;
}

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const origin = error.config;
    if (error.response.status === 401 && !origin._retry) {
      origin._retry = true;
      await useAuthStore().reissue(origin);
      return axiosInstance(origin);
    }
    return Promise.reject(error);
  }
);

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: useStorage("isLoggedIn", false),
  }),
  actions: {
    async login(code: string) {
      try {
        const res = await axiosInstance.post("/api/auth/login/callback", {
          code,
        });
        axiosInstance.defaults.headers.common.Authorization =
          res.headers.authorization;
        this.isLoggedIn = true;
      } catch (e) {
        throw new Error("Login failed");
      }
    },

    async logout() {
      try {
        await axiosInstance.post("/api/auth/logout");
        delete axiosInstance.defaults.headers.common.Authorization;
        this.isLoggedIn = false;
      } catch (e) {
        delete axiosInstance.defaults.headers.common.Authorization;
        this.isLoggedIn = false;
        throw new Error("Logout failed");
      }
    },

    async reissue(origin: any) {
      try {
        const res = await axiosInstance.get("/api/auth/reissue");
        origin.headers.Authorization = res.headers.authorization;
        axiosInstance.defaults.headers.common.Authorization =
          res.headers.authorization;
        this.isLoggedIn = true;
      } catch (e) {
        this.isLoggedIn = false;
      }
    },
  },
});
