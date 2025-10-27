import { useCallback, useEffect, useState } from "react";
import { API_ENDPOINTS } from "../constants/api";
import { MovieCredits, UseMovieCreditsResult } from "../types/movie";
import tmdbAxios from "../utils/api";

const useMovieCredits = (movieId: number | null): UseMovieCreditsResult => {
  const [credits, setCredits] = useState<MovieCredits | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMovieCredits = useCallback(async () => {
    if (!movieId) {
      setCredits(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await tmdbAxios.get<MovieCredits>(
        `${API_ENDPOINTS.MOVIE_CREDITS}/${movieId}/credits?language=en-US`
      );

      setCredits(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching movie credits"
      );
      console.error("Error fetching movie credits:", err);
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  const refreshCredits = useCallback(() => {
    fetchMovieCredits();
  }, [fetchMovieCredits]);

  useEffect(() => {
    fetchMovieCredits();
  }, [fetchMovieCredits]);

  return {
    credits,
    loading,
    error,
    refreshCredits
  };
};

export default useMovieCredits;
