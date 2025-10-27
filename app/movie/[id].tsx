import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { Text } from "../../components";
import { TMDB_IMAGE_BASE_URL } from "../../constants/api";
import { useWatchlist } from "../../contexts/WatchlistContext";
import {
  useMovieCredits,
  useMovieDetails,
  useMovieRecommendations
} from "../../hooks";

const { height: screenHeight } = Dimensions.get("window");

export default function MovieDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const movieId = parseInt(params.id as string);

  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  const {
    movieDetails,
    loading: detailsLoading,
    error: detailsError
  } = useMovieDetails(movieId);
  const { credits } = useMovieCredits(movieId);
  const { recommendations, loading: recommendationsLoading } =
    useMovieRecommendations(movieId);

  const [isWatchListed, setIsWatchListed] = useState(false);

  useEffect(() => {
    if (movieDetails) {
      setIsWatchListed(isInWatchlist(movieDetails.id));
    }
  }, [movieDetails, isInWatchlist]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getDirector = () => {
    if (!credits?.crew) return null;
    return credits.crew.find((person) => person.job === "Director");
  };

  const getWriter = () => {
    if (!credits?.crew) return null;
    return credits.crew.find(
      (person) =>
        person.job === "Writer" ||
        person.job === "Screenplay" ||
        person.job === "Story"
    );
  };

  if (detailsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00B4E4" />
        <Text weight="regular" style={styles.loadingText}>
          Loading movie details...
        </Text>
      </View>
    );
  }

  if (detailsError || !movieDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text weight="regular" style={styles.errorText}>
          Failed to load movie details
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text weight="semibold" style={styles.retryButtonText}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const director = getDirector();
  const writer = getWriter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header with backdrop and gradient */}
      <View style={styles.headerContainer}>
        <Image
          source={{
            uri: `${TMDB_IMAGE_BASE_URL}${movieDetails.backdrop_path}`
          }}
          style={styles.backdropImage}
          resizeMode="cover"
        />
        <View style={styles.gradient} />

        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>

        {/* Movie title and year */}
        <View style={styles.titleContainer}>
          <Text weight="bold" style={styles.movieTitle}>
            {movieDetails.title} (
            {new Date(movieDetails.release_date).getFullYear()})
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Movie info section */}
        <View style={styles.movieInfoSection}>
          <View style={styles.movieInfoRow}>
            <Image
              source={{
                uri: `${TMDB_IMAGE_BASE_URL}${movieDetails.poster_path}`
              }}
              style={styles.posterImage}
              resizeMode="cover"
            />

            <View style={styles.movieInfoDetails}>
              {/* Rating badge */}
              <View style={styles.ratingBadge}>
                <Text weight="bold" style={styles.ratingText}>
                  PG13
                </Text>
              </View>

              {/* Release info */}
              <Text weight="regular" style={styles.releaseInfo}>
                {formatDate(movieDetails.release_date)} (SG) •{" "}
                {formatRuntime(movieDetails.runtime)}
              </Text>

              {/* Genres */}
              <Text weight="regular" style={styles.genresText}>
                {movieDetails.genres?.map((genre) => genre.name).join(", ")}
              </Text>

              {/* Status */}
              <Text weight="regular" style={styles.statusText}>
                Status: {movieDetails.status}
              </Text>

              {/* Original Language */}
              <Text weight="regular" style={styles.languageText}>
                Original Language:{" "}
                {movieDetails.original_language?.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* User Score */}
          <View style={styles.userScoreSection}>
            <View style={styles.scoreCircle}>
              <Text weight="bold" style={styles.scoreNumber}>
                {Math.round(movieDetails.vote_average * 10)}
              </Text>
              <Text weight="regular" style={styles.scorePercent}>
                %
              </Text>
            </View>
            <Text weight="semibold" style={styles.userScoreLabel}>
              User Score
            </Text>
          </View>

          {/* Director and Writer */}
          <View style={styles.crewSection}>
            {director && (
              <View style={styles.crewMember}>
                <Text weight="bold" style={styles.crewName}>
                  {director.name}
                </Text>
                <Text weight="regular" style={styles.crewJob}>
                  Director, Writer
                </Text>
              </View>
            )}
            {writer && writer.id !== director?.id && (
              <View style={styles.crewMember}>
                <Text weight="bold" style={styles.crewName}>
                  {writer.name}
                </Text>
                <Text weight="regular" style={styles.crewJob}>
                  Writer
                </Text>
              </View>
            )}
          </View>

          {/* Tagline */}
          {movieDetails.tagline && (
            <Text weight="regular" italic style={styles.tagline}>
              {movieDetails.tagline}
            </Text>
          )}

          {/* Add to Watchlist button */}
          <TouchableOpacity
            style={styles.watchlistButton}
            onPress={async () => {
              if (isWatchListed) {
                await removeFromWatchlist(movieDetails.id);
                setIsWatchListed(false);
              } else {
                await addToWatchlist(movieDetails);
                setIsWatchListed(true);
              }
            }}
          >
            <Ionicons
              name={isWatchListed ? "bookmark" : "bookmark-outline"}
              size={20}
              color="white"
            />
            <Text weight="semibold" style={styles.watchlistButtonText}>
              {isWatchListed ? "Remove from Watchlist" : "Add To Watchlist"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Overview Section */}
        <View style={styles.overviewSection}>
          <Text weight="bold" style={styles.sectionTitle}>
            Overview
          </Text>
          <Text weight="regular" style={styles.overviewText}>
            {movieDetails.overview}
          </Text>
        </View>

        {/* Top Billed Cast */}
        {credits && credits.cast && credits.cast.length > 0 && (
          <View style={styles.castSection}>
            <Text weight="bold" style={styles.sectionTitle}>
              Top Billed Cast
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.castScrollView}
            >
              {credits.cast.slice(0, 10).map((actor) => (
                <View key={actor.id} style={styles.castCard}>
                  <Image
                    source={{
                      uri: `${TMDB_IMAGE_BASE_URL}${actor.profile_path}`
                    }}
                    style={styles.castImage}
                    resizeMode="cover"
                  />
                  <View style={styles.castInfo}>
                    <Text
                      weight="bold"
                      style={styles.actorName}
                      numberOfLines={2}
                    >
                      {actor.name}
                    </Text>
                    <Text
                      weight="regular"
                      style={styles.characterName}
                      numberOfLines={2}
                    >
                      {actor.character}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Recommendations Section */}
        {recommendations && recommendations.length > 0 && (
          <View style={styles.recommendationsSection}>
            <Text weight="bold" style={styles.sectionTitle}>
              Recommendations
            </Text>
            {recommendationsLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#00B4E4" />
                <Text weight="regular">Loading recommendations...</Text>
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.recommendationsScrollView}
              >
                {recommendations.slice(0, 10).map((movie) => (
                  <TouchableOpacity
                    key={movie.id}
                    style={styles.recommendationCard}
                    onPress={() => router.push(`/movie/${movie.id}`)}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={{
                        uri: `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
                      }}
                      style={styles.recommendationImage}
                      resizeMode="cover"
                    />
                    <Text
                      weight="bold"
                      style={styles.recommendationTitle}
                      numberOfLines={2}
                    >
                      {movie.title}
                    </Text>
                    <Text weight="bold" style={styles.recommendationRating}>
                      {Math.round(movie.vote_average * 10)}%
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666"
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20
  },
  errorText: {
    fontSize: 18,
    color: "#ff6b6b",
    textAlign: "center",
    marginBottom: 20
  },
  retryButton: {
    backgroundColor: "#00B4E4",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500"
  },
  headerContainer: {
    height: screenHeight * 0.35,
    position: "relative"
  },
  backdropImage: {
    width: "100%",
    height: "100%"
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "10%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "rgba(209, 112, 68, 0.6)"
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
    padding: 8
  },
  titleContainer: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#00B4E4",
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  movieInfoSection: {
    padding: 20
  },
  movieInfoRow: {
    flexDirection: "row",
    marginBottom: 20
  },
  posterImage: {
    width: 120,
    height: 180,
    borderRadius: 10,
    marginRight: 15
  },
  movieInfoDetails: {
    flex: 1
  },
  ratingBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 8
  },
  ratingText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold"
  },
  releaseInfo: {
    color: "white",
    fontSize: 14,
    marginBottom: 8
  },
  genresText: {
    color: "white",
    fontSize: 14,
    marginBottom: 8
  },
  statusText: {
    color: "white",
    fontSize: 14,
    marginBottom: 8
  },
  languageText: {
    color: "white",
    fontSize: 14
  },
  userScoreSection: {
    alignItems: "center",
    marginBottom: 20
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2d3748",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#48bb78",
    flexDirection: "row",
    marginBottom: 8
  },
  scoreNumber: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold"
  },
  scorePercent: {
    color: "white",
    fontSize: 12,
    alignSelf: "flex-start",
    marginTop: 4
  },
  userScoreLabel: {
    color: "white",
    fontSize: 16,
    fontWeight: "500"
  },
  crewSection: {
    marginBottom: 20
  },
  crewMember: {
    marginBottom: 10
  },
  crewName: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },
  crewJob: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14
  },
  tagline: {
    color: "white",
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 20
  },
  watchlistButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)"
  },
  watchlistButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8
  },
  overviewSection: {
    backgroundColor: "white",
    marginTop: 20,
    paddingVertical: 20
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    paddingHorizontal: 20
  },
  overviewText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    paddingHorizontal: 20
  },
  castSection: {
    backgroundColor: "white",
    paddingTop: 20,
    paddingBottom: 10
  },
  castScrollView: {
    paddingLeft: 20
  },
  castCard: {
    width: 140,
    marginRight: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  castImage: {
    width: "100%",
    height: 180
  },
  castInfo: {
    padding: 10
  },
  actorName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4
  },
  characterName: {
    fontSize: 12,
    color: "#666"
  },
  recommendationsSection: {
    backgroundColor: "white",
    paddingTop: 20,
    paddingBottom: 40
  },
  recommendationsScrollView: {
    paddingLeft: 20
  },
  recommendationCard: {
    width: 160,
    marginRight: 15
  },
  recommendationImage: {
    width: "100%",
    height: 240,
    borderRadius: 10,
    marginBottom: 8
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4
  },
  recommendationRating: {
    fontSize: 12,
    color: "#00B4E4",
    fontWeight: "bold"
  }
});
