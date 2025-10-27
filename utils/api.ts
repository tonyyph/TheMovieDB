import axios, { AxiosInstance } from "axios";
import { TMDB_API_BASE_URL, TMDB_BEARER_TOKEN } from "../constants/api";

const tmdbAxios: AxiosInstance = axios.create({
  baseURL: TMDB_API_BASE_URL,
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
    accept: "application/json",
    "Content-Type": "application/json"
  }
});

tmdbAxios.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

tmdbAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          throw new Error("Unauthorized: Invalid API key or token");
        case 404:
          throw new Error("Resource not found");
        case 429:
          throw new Error("Rate limit exceeded. Please try again later");
        case 500:
          throw new Error("Internal server error");
        default:
          throw new Error(
            `API Error: ${error.response.status} - ${error.response.statusText}`
          );
      }
    } else if (error.request) {
      throw new Error("Network error: Please check your internet connection");
    } else {
      // Other error
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
);

export default tmdbAxios;
