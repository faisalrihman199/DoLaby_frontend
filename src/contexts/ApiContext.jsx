import axios from "axios";
import React, { createContext, useContext } from "react";
import { useAPP } from "./AppContext";

const ApiContext = createContext();

const ApiProvider = ({ children }) => {
  const { user, login: saveTokens, logout } = useAPP();
  const base_url = import.meta.env.VITE_APP_API_URL;

  // Axios instance
  const api = axios.create({ baseURL: base_url });

  // Refresh token logic (optional, can remove if not needed)
  const refreshToken = async () => {
    const refreshTok = user?.tokens?.refreshToken || (() => {
      try { return localStorage.getItem('refreshToken') } catch { return null }
    })()
    if (!refreshTok) return null;
    try {
      const res = await axios.post(`${base_url}/auth/refresh`, {
        refreshToken: refreshTok,
      });
      const tokens = res?.data?.data?.tokens || res?.data?.tokens || null;
      if (tokens) {
        // saveTokens will merge tokens into AppContext and persist
        saveTokens(tokens);
        return tokens.accessToken;
      }
    } catch (err) {
      logout();
      throw err;
    }
  };

  // Request interceptor for Bearer token
  api.interceptors.request.use(
    (config) => {
      const access = user?.tokens?.accessToken || (() => {
        try { return localStorage.getItem('accessToken') } catch { return null }
      })()
      if (access) {
        config.headers.Authorization = `Bearer ${access}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for token refresh
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const hasRefresh = user?.tokens?.refreshToken || (() => {
        try { return !!localStorage.getItem('refreshToken') } catch { return false }
      })()
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        hasRefresh
      ) {
        originalRequest._retry = true;
        const newAccess = await refreshToken();
        if (newAccess) {
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return api(originalRequest);
        }
      }
      return Promise.reject(error);
    }
  );

  // Core API methods
  const get = async (endpoint, config) => (await api.get(endpoint, config)).data;
  const post = async (endpoint, data, config) => (await api.post(endpoint, data, config)).data;
  const put = async (endpoint, data, config) => (await api.put(endpoint, data, config)).data;
  const del = async (endpoint, config) => (await api.delete(endpoint, config)).data;

  const provider = { get, post, put, delete: del };

  return <ApiContext.Provider value={provider}>{children}</ApiContext.Provider>;
};

const useAPI = () => useContext(ApiContext);

export { ApiProvider, useAPI };
