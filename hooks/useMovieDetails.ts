import { useCallback, useEffect, useState } from "react";
import { API_ENDPOINTS } from "../constants/api";
import { MovieDetails, UseMovieDetailsResult } from "../types/movie";
import tmdbAxios from "../utils/api";

const useMovieDetails = (movieId: number | null): UseMovieDetailsResult => {
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMovieDetails = useCallback(async () => {
    if (!movieId) {
      setMovieDetails(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await tmdbAxios.get<MovieDetails>(
        `${API_ENDPOINTS.MOVIE_DETAILS}/${movieId}?language=en-US`
      );

      setMovieDetails(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching movie details"
      );
      console.error("Error fetching movie details:", err);
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  const refreshMovieDetails = useCallback(() => {
    fetchMovieDetails();
  }, [fetchMovieDetails]);

  useEffect(() => {
    fetchMovieDetails();
  }, [fetchMovieDetails]);

  return {
    movieDetails,
    loading,
    error,
    refreshMovieDetails
  };
};

export default useMovieDetails;
