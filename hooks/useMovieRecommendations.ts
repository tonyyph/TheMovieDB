import { useCallback, useEffect, useState } from "react";
import { API_ENDPOINTS } from "../constants/api";
import {
  Movie,
  MoviesResponse,
  UseMovieRecommendationsResult
} from "../types/movie";
import tmdbAxios from "../utils/api";

const useMovieRecommendations = (
  movieId: number | null
): UseMovieRecommendationsResult => {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    if (!movieId) {
      setRecommendations([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await tmdbAxios.get<MoviesResponse>(
        `${API_ENDPOINTS.MOVIE_RECOMMENDATIONS}/${movieId}/recommendations?language=en-US&page=1`
      );

      setRecommendations(response.data.results);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching movie recommendations"
      );
      console.error("Error fetching movie recommendations:", err);
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  const refreshRecommendations = useCallback(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return {
    recommendations,
    loading,
    error,
    refreshRecommendations
  };
};

export default useMovieRecommendations;
