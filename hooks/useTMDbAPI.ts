import { useCallback, useEffect, useState } from "react";
import { API_ENDPOINTS, TMDB_ACCOUNT_ID } from "../constants/api";
import {
  Account,
  MovieCredits,
  MovieDetails,
  MoviesResponse
} from "../types/movie";
import tmdbAxios from "../utils/api";

// Combined hook that demonstrates all API calls
export const useTMDbAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get popular movies
  const getPopularMovies = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await tmdbAxios.get<MoviesResponse>(
        `${API_ENDPOINTS.POPULAR}?language=en-US&page=${page}`
      );

      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch popular movies";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get now playing movies
  const getNowPlayingMovies = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await tmdbAxios.get<MoviesResponse>(
        `${API_ENDPOINTS.NOW_PLAYING}?language=en-US&page=${page}`
      );

      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch now playing movies";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get upcoming movies
  const getUpcomingMovies = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await tmdbAxios.get<MoviesResponse>(
        `${API_ENDPOINTS.UPCOMING}?language=en-US&page=${page}`
      );

      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch upcoming movies";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get movie details
  const getMovieDetails = useCallback(async (movieId: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await tmdbAxios.get<MovieDetails>(
        `${API_ENDPOINTS.MOVIE_DETAILS}/${movieId}?language=en-US`
      );

      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch movie details";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get movie credits
  const getMovieCredits = useCallback(async (movieId: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await tmdbAxios.get<MovieCredits>(
        `${API_ENDPOINTS.MOVIE_CREDITS}/${movieId}/credits?language=en-US`
      );

      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch movie credits";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get movie recommendations
  const getMovieRecommendations = useCallback(
    async (movieId: number, page: number = 1) => {
      try {
        setLoading(true);
        setError(null);

        const response = await tmdbAxios.get<MoviesResponse>(
          `${API_ENDPOINTS.MOVIE_RECOMMENDATIONS}/${movieId}/recommendations?language=en-US&page=${page}`
        );

        return response.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to fetch movie recommendations";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Get account details
  const getAccountDetails = useCallback(
    async (accountId: number = TMDB_ACCOUNT_ID) => {
      try {
        setLoading(true);
        setError(null);

        const response = await tmdbAxios.get<Account>(
          `${API_ENDPOINTS.ACCOUNT}/${accountId}`
        );

        return response.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to fetch account details";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Search movies
  const searchMovies = useCallback(async (query: string, page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await tmdbAxios.get<MoviesResponse>(
        `/search/movie?query=${encodeURIComponent(
          query
        )}&language=en-US&page=${page}`
      );

      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to search movies";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get multiple movie details at once
  const getMultipleMovieDetails = useCallback(async (movieIds: number[]) => {
    try {
      setLoading(true);
      setError(null);

      // Use Promise.all to fetch multiple movies concurrently
      const responses = await Promise.all(
        movieIds.map((id) =>
          tmdbAxios.get<MovieDetails>(
            `${API_ENDPOINTS.MOVIE_DETAILS}/${id}?language=en-US`
          )
        )
      );

      return responses.map((response) => response.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch multiple movie details";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // State
    loading,
    error,

    // Methods
    getPopularMovies,
    getNowPlayingMovies,
    getUpcomingMovies,
    getMovieDetails,
    getMovieCredits,
    getMovieRecommendations,
    getAccountDetails,
    searchMovies,
    getMultipleMovieDetails,

    // Utility
    clearError: () => setError(null)
  };
};

// Hook for configuration and health check
export const useTMDbConfig = () => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [config, setConfig] = useState<any>(null);

  const checkHealth = useCallback(async () => {
    try {
      // Try to fetch account details as a health check
      await tmdbAxios.get(`${API_ENDPOINTS.ACCOUNT}/${TMDB_ACCOUNT_ID}`);
      setIsHealthy(true);
      return true;
    } catch (error) {
      console.error("TMDb API health check failed:", error);
      setIsHealthy(false);
      return false;
    }
  }, []);

  const getConfiguration = useCallback(async () => {
    try {
      const response = await tmdbAxios.get("/configuration");
      setConfig(response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch TMDb configuration:", error);
      throw error;
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return {
    isHealthy,
    config,
    checkHealth,
    getConfiguration
  };
};
