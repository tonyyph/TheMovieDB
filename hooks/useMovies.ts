import { useCallback, useEffect, useState } from "react";
import { API_ENDPOINTS } from "../constants/api";
import {
  Movie,
  MovieCategory,
  MoviesResponse,
  UseMoviesResult
} from "../types/movie";
import tmdbAxios from "../utils/api";

const useMovies = (category: MovieCategory): UseMoviesResult => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getEndpoint = (category: MovieCategory): string => {
    switch (category) {
      case "Now Playing":
        return API_ENDPOINTS.NOW_PLAYING;
      case "Popular":
        return API_ENDPOINTS.POPULAR;
      case "Upcoming":
        return API_ENDPOINTS.UPCOMING;
      default:
        return API_ENDPOINTS.NOW_PLAYING;
    }
  };

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = getEndpoint(category);

      const response = await tmdbAxios.get<MoviesResponse>(
        `${endpoint}?language=en-US&page=1`
      );

      setMovies(response.data.results);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching movies"
      );
      console.error("Error fetching movies:", err);
    } finally {
      setLoading(false);
    }
  }, [category]);

  const refreshMovies = useCallback(() => {
    fetchMovies();
  }, [fetchMovies]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return {
    movies,
    loading,
    error,
    refreshMovies
  };
};

export default useMovies;
