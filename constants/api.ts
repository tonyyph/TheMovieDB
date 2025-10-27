// Environment variables
export const TMDB_API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
export const TMDB_API_KEY = process.env.EXPO_PUBLIC_API_KEY || "";
export const TMDB_BEARER_TOKEN = process.env.EXPO_PUBLIC_ACCESS_TOKEN || "";
export const TMDB_IMAGE_BASE_URL = process.env.EXPO_PUBLIC_IMAGE_BASE_URL;
export const TMDB_ACCOUNT_ID = parseInt(
  process.env.EXPO_PUBLIC_ACCOUNT_ID || "0",
  10
);

export const API_ENDPOINTS = {
  NOW_PLAYING: "/movie/now_playing",
  POPULAR: "/movie/popular",
  UPCOMING: "/movie/upcoming",
  MOVIE_DETAILS: "/movie",
  MOVIE_CREDITS: "/movie",
  MOVIE_RECOMMENDATIONS: "/movie",
  ACCOUNT: "/account"
} as const;
