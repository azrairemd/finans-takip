import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://localhost:5256";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const MarketApi = {
  getAll: () => api.get("/api/market").then((r) => r.data),
  getBySymbol: (symbol: string) =>
    api.get(`/api/market/${symbol}`).then((r) => r.data),
  search: (q: string) =>
    api.get("/api/market/search", { params: { q } }).then((r) => r.data),
};

export const WatchlistApi = {
  getMine: (userId: string) =>
    api.get("/api/watchlist", { params: { userId } }).then((r) => r.data),
  add: (userId: string, symbol: string) =>
    api
      .post("/api/watchlist", { symbol }, { params: { userId } })
      .then((r) => r.data),
  remove: (id: string, userId: string) =>
    api.delete(`/api/watchlist/${id}`, { params: { userId } }),
};

export const AuthApi = {
  loginWithGoogle: (idToken: string) =>
    api.post("/api/auth/google", { idToken }).then((r) => r.data),
};
