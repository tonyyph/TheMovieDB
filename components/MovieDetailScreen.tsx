import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { TMDB_IMAGE_BASE_URL } from "../constants/api";
import { useAccount, useMovieCredits, useMovieDetails } from "../hooks";

interface MovieDetailScreenProps {
  movieId: number;
  accountId?: number;
}

const MovieDetailScreen: React.FC<MovieDetailScreenProps> = ({
  movieId,
  accountId = 22415362
}) => {
  const {
    movieDetails,
    loading: detailsLoading,
    error: detailsError
  } = useMovieDetails(movieId);
  const {
    credits,
    loading: creditsLoading,
    error: creditsError
  } = useMovieCredits(movieId);
  const {
    account,
    loading: accountLoading,
    error: accountError
  } = useAccount(accountId);

  if (detailsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5cb3cc" />
        <Text style={styles.loadingText}>Loading movie details...</Text>
      </View>
    );
  }

  if (detailsError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {detailsError}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Movie Details Section */}
      {movieDetails && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Movie Details</Text>
          <View style={styles.movieHeader}>
            <Image
              source={{
                uri: `${TMDB_IMAGE_BASE_URL}${movieDetails.poster_path}`
              }}
              style={styles.poster}
              resizeMode="cover"
            />
            <View style={styles.movieInfo}>
              <Text style={styles.movieTitle}>{movieDetails.title}</Text>
              <Text style={styles.movieTagline}>{movieDetails.tagline}</Text>
              <Text style={styles.movieOverview}>{movieDetails.overview}</Text>
              <Text style={styles.movieDetail}>
                Runtime: {movieDetails.runtime} minutes
              </Text>
              <Text style={styles.movieDetail}>
                Rating: {movieDetails.vote_average.toFixed(1)}/10
              </Text>
              <Text style={styles.movieDetail}>
                Release Date: {movieDetails.release_date}
              </Text>
            </View>
          </View>

          {movieDetails.genres && movieDetails.genres.length > 0 && (
            <View style={styles.genresContainer}>
              <Text style={styles.subTitle}>Genres:</Text>
              <View style={styles.genresList}>
                {movieDetails.genres.map((genre) => (
                  <Text key={genre.id} style={styles.genre}>
                    {genre.name}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>
      )}

      {/* Credits Section */}
      {creditsLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#5cb3cc" />
          <Text>Loading credits...</Text>
        </View>
      ) : creditsError ? (
        <Text style={styles.errorText}>
          Error loading credits: {creditsError}
        </Text>
      ) : (
        credits && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cast</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {credits.cast.slice(0, 10).map((actor) => (
                <View key={actor.id} style={styles.castMember}>
                  {actor.profile_path && (
                    <Image
                      source={{
                        uri: `${TMDB_IMAGE_BASE_URL}${actor.profile_path}`
                      }}
                      style={styles.castImage}
                      resizeMode="cover"
                    />
                  )}
                  <Text style={styles.castName}>{actor.name}</Text>
                  <Text style={styles.castCharacter}>{actor.character}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )
      )}

      {/* Account Section */}
      {accountLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#5cb3cc" />
          <Text>Loading account...</Text>
        </View>
      ) : accountError ? (
        <Text style={styles.errorText}>
          Error loading account: {accountError}
        </Text>
      ) : (
        account && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            <View style={styles.accountInfo}>
              <Text style={styles.accountDetail}>
                Username: {account.username}
              </Text>
              <Text style={styles.accountDetail}>Name: {account.name}</Text>
              <Text style={styles.accountDetail}>ID: {account.id}</Text>
              <Text style={styles.accountDetail}>
                Language: {account.iso_639_1}
              </Text>
              <Text style={styles.accountDetail}>
                Country: {account.iso_3166_1}
              </Text>
            </View>
          </View>
        )
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
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
    padding: 20
  },
  errorText: {
    fontSize: 16,
    color: "#ff6b6b",
    textAlign: "center"
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E3E3E3"
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333"
  },
  movieHeader: {
    flexDirection: "row",
    marginBottom: 15
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginRight: 15
  },
  movieInfo: {
    flex: 1
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5
  },
  movieTagline: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#666",
    marginBottom: 10
  },
  movieOverview: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 10
  },
  movieDetail: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10
  },
  genresContainer: {
    marginTop: 15
  },
  genresList: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  genre: {
    backgroundColor: "#5cb3cc",
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 14
  },
  castMember: {
    width: 100,
    marginRight: 15,
    alignItems: "center"
  },
  castImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginBottom: 8
  },
  castName: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 4
  },
  castCharacter: {
    fontSize: 12,
    color: "#666",
    textAlign: "center"
  },
  accountInfo: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 8
  },
  accountDetail: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8
  }
});

export default MovieDetailScreen;
