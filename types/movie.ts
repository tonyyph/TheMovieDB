export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  adult: boolean;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
  dates?: {
    maximum: string;
    minimum: string;
  };
}

export type MovieCategory = "Now Playing" | "Popular" | "Upcoming";

export interface UseMoviesResult {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  refreshMovies: () => void;
}

// Detailed movie information
export interface MovieDetails extends Movie {
  budget: number;
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
  genres: Genre[];
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  belongs_to_collection?: Collection;
  homepage?: string;
  imdb_id?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path?: string;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface Collection {
  id: number;
  name: string;
  poster_path?: string;
  backdrop_path?: string;
}

// Movie credits
export interface MovieCredits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export interface CastMember {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path?: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface CrewMember {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path?: string;
  credit_id: string;
  department: string;
  job: string;
}

// Account information
export interface Account {
  avatar: {
    gravatar: {
      hash: string;
    };
    tmdb: {
      avatar_path?: string;
    };
  };
  id: number;
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  include_adult: boolean;
  username: string;
}

// Hook result interfaces
export interface UseMovieDetailsResult {
  movieDetails: MovieDetails | null;
  loading: boolean;
  error: string | null;
  refreshMovieDetails: () => void;
}

export interface UseMovieCreditsResult {
  credits: MovieCredits | null;
  loading: boolean;
  error: string | null;
  refreshCredits: () => void;
}

export interface UseAccountResult {
  account: Account | null;
  loading: boolean;
  error: string | null;
  refreshAccount: () => void;
}

export interface UseMovieRecommendationsResult {
  recommendations: Movie[];
  loading: boolean;
  error: string | null;
  refreshRecommendations: () => void;
}
