import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { Text } from "../../components";
import { TMDB_IMAGE_BASE_URL } from "../../constants/api";
import { useWatchlist } from "../../contexts/WatchlistContext";

type SortOption = "alphabetical" | "rating" | "release_date";

export default function BookmarkScreen() {
  const router = useRouter();
  const { watchlist, removeFromWatchlist, loading } = useWatchlist();
  const [sortBy, setSortBy] = useState<SortOption>("alphabetical");
  const [orderAsc, setOrderAsc] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case "alphabetical":
        return "By alphabetical order";
      case "rating":
        return "By rating";
      case "release_date":
        return "By release date";
      default:
        return "By alphabetical order";
    }
  };

  // Then sort the filtered results
  const sortedWatchlist = [...watchlist].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "alphabetical":
        comparison = a.title.localeCompare(b.title);
        break;
      case "rating":
        comparison = a.vote_average - b.vote_average;
        break;
      case "release_date":
        comparison =
          new Date(a.release_date).getTime() -
          new Date(b.release_date).getTime();
        break;
    }

    return orderAsc ? comparison : -comparison;
  });

  const handleRemoveFromWatchlist = async (movieId: number) => {
    await removeFromWatchlist(movieId);
  };

  const handleMoviePress = (movieId: number) => {
    router.push(`/movie/${movieId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Logo */}
        <View style={styles.header}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Text weight="regular" style={styles.avatarText}>
                TV
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text weight="bold" style={styles.userName}>
                Tony Vincent
              </Text>
              <Text weight="regular" style={styles.memberSince}>
                Member since August 2025
              </Text>
            </View>
          </View>
        </View>

        {/* Watchlist Section */}
        <View style={styles.watchlistSection}>
          <Text weight="bold" style={styles.sectionTitle}>
            My Watchlist
          </Text>

          {/* Filter Section */}
          <View style={styles.filterSection}>
            <View style={styles.filterRow}>
              <Text weight="regular" style={styles.filterLabel}>
                Sort by:
              </Text>
              <TouchableOpacity
                style={styles.filterDropdown}
                onPress={() => setShowSortModal(true)}
              >
                <Text weight="semibold" style={styles.filterValue}>
                  {getSortLabel()}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#5cb3cc" />
              </TouchableOpacity>
            </View>

            <View style={styles.orderRow}>
              <Text weight="regular" style={styles.filterLabel}>
                Order:
              </Text>
              <TouchableOpacity onPress={() => setOrderAsc(!orderAsc)}>
                <Ionicons
                  name={orderAsc ? "arrow-up" : "arrow-down"}
                  size={20}
                  color="#333"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Watchlist Items */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#5cb3cc" />
              <Text weight="regular" style={styles.loadingText}>
                Loading watchlist...
              </Text>
            </View>
          ) : watchlist.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="bookmark-outline" size={64} color="#ccc" />
              <Text weight="semibold" style={styles.emptyTitle}>
                Your watchlist is empty
              </Text>
              <Text weight="regular" style={styles.emptyText}>
                Add movies to your watchlist to see them here
              </Text>
            </View>
          ) : (
            sortedWatchlist.map((movie) => (
              <View key={movie.id} style={styles.watchlistCard}>
                <TouchableOpacity
                  style={styles.movieContent}
                  onPress={() => handleMoviePress(movie.id)}
                  activeOpacity={0.7}
                >
                  <Image
                    source={{
                      uri: `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
                    }}
                    style={styles.moviePoster}
                    resizeMode="cover"
                  />
                  <View style={styles.movieInfo}>
                    <Text
                      weight="bold"
                      style={styles.movieTitle}
                      numberOfLines={2}
                    >
                      {movie.title}
                    </Text>
                    <Text weight="regular" style={styles.movieDate}>
                      {formatDate(movie.release_date)}
                    </Text>
                    <Text
                      weight="regular"
                      style={styles.movieDescription}
                      numberOfLines={2}
                    >
                      {movie.overview}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveFromWatchlist(movie.id)}
                >
                  <Ionicons name="close" size={24} color="#999" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Sort Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSortModal}
        onRequestClose={() => setShowSortModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowSortModal(false)}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text weight="bold" style={styles.modalTitle}>
                Sort by
              </Text>
              <TouchableOpacity onPress={() => setShowSortModal(false)}>
                <Ionicons name="chevron-down" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.sortOption,
                sortBy === "alphabetical" && styles.sortOptionActive
              ]}
              onPress={() => {
                setSortBy("alphabetical");
                setShowSortModal(false);
              }}
            >
              <Text
                weight={sortBy === "alphabetical" ? "semibold" : "regular"}
                style={[
                  styles.sortOptionText,
                  sortBy === "alphabetical" && styles.sortOptionTextActive
                ]}
              >
                By alphabetical order
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sortOption,
                sortBy === "rating" && styles.sortOptionActive
              ]}
              onPress={() => {
                setSortBy("rating");
                setShowSortModal(false);
              }}
            >
              <Text
                weight={sortBy === "rating" ? "semibold" : "regular"}
                style={[
                  styles.sortOptionText,
                  sortBy === "rating" && styles.sortOptionTextActive
                ]}
              >
                By rating
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sortOption,
                sortBy === "release_date" && styles.sortOptionActive
              ]}
              onPress={() => {
                setSortBy("release_date");
                setShowSortModal(false);
              }}
            >
              <Text
                weight={sortBy === "release_date" ? "semibold" : "regular"}
                style={[
                  styles.sortOptionText,
                  sortBy === "release_date" && styles.sortOptionTextActive
                ]}
              >
                By release date
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  scrollView: {
    flex: 1
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#fff"
  },
  logo: {
    width: 80,
    height: 60
  },
  profileSection: {
    backgroundColor: "#042541",
    paddingVertical: 40,
    paddingHorizontal: 20,
    position: "relative"
  },
  backButton: {
    position: "absolute",
    top: 12,
    left: 0,
    zIndex: 10,
    backgroundColor: "transparent",
    borderRadius: 20,
    padding: 8
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#9747FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20
  },
  avatarText: {
    fontSize: 36,
    color: "white"
  },
  userInfo: {
    flex: 1
  },
  userName: {
    fontSize: 24,
    color: "white",
    marginBottom: 5
  },
  memberSince: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)"
  },
  watchlistSection: {
    padding: 20
  },
  sectionTitle: {
    fontSize: 24,
    color: "#333",
    marginBottom: 20
  },
  filterSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E3E3E3"
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  filterLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 10
  },
  filterDropdown: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5
  },
  filterValue: {
    fontSize: 14,
    color: "#5cb3cc",
    marginRight: 5
  },
  orderRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  watchlistCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: "row",
    elevation: 2,
    borderColor: "#E3E3E3",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: "relative"
  },
  movieContent: {
    flex: 1,
    flexDirection: "row"
  },
  moviePoster: {
    width: 100,
    height: 150,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10
  },
  movieInfo: {
    flex: 1,
    padding: 15
  },
  movieTitle: {
    fontSize: 18,
    color: "#333",
    marginBottom: 5
  },
  movieDate: {
    fontSize: 14,
    color: "#999",
    marginBottom: 8
  },
  movieDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20
  },
  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666"
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40
  },
  emptyTitle: {
    fontSize: 20,
    color: "#333",
    marginTop: 20,
    marginBottom: 10
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center"
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0"
  },
  modalTitle: {
    fontSize: 24,
    color: "#333"
  },
  sortOption: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0"
  },
  sortOptionActive: {
    backgroundColor: "#5cb3cc"
  },
  sortOptionText: {
    fontSize: 18,
    color: "#333"
  },
  sortOptionTextActive: {
    color: "#fff"
  }
});
