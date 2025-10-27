import { Text } from "@/components";
import { TMDB_IMAGE_BASE_URL } from "@/constants/api";
import useMovies from "@/hooks/useMovies";
import { MovieCategory } from "@/types/movie";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";

type SortOption = "alphabetical" | "rating" | "release_date" | "sort_by";

export default function HomeScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] =
    useState<MovieCategory>("Now Playing");
  const [searchText, setSearchText] = useState("");
  const [activeSearchText, setActiveSearchText] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("alphabetical");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const categories: MovieCategory[] = ["Now Playing", "Upcoming", "Popular"];
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "alphabetical", label: "By alphabetical order" },
    { value: "rating", label: "By rating" },
    { value: "release_date", label: "By release date" }
  ];

  const { movies, loading, error, refreshMovies } = useMovies(selectedCategory);

  const handleMoviePress = (movieId: number) => {
    router.push(`/movie/${movieId}`);
  };

  const handleSearch = () => {
    // If search text is empty, clear the filter to show all movies
    if (!searchText.trim()) {
      setActiveSearchText("");
    } else {
      setActiveSearchText(searchText);
    }
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

  // Filter by search text (only after search button is clicked)
  const filteredMovies = (movies || []).filter((movie) => {
    if (!activeSearchText.trim()) return true;
    return movie.title.toLowerCase().includes(activeSearchText.toLowerCase());
  });

  // Sort filtered movies
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch (sortBy) {
      case "alphabetical":
        return a.title.localeCompare(b.title);
      case "rating":
        return b.vote_average - a.vote_average; // Highest first
      case "release_date":
        return (
          new Date(b.release_date).getTime() -
          new Date(a.release_date).getTime()
        ); // Newest first
      default:
        return 0;
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            {/* Header with Logo */}
            <View style={styles.header}>
              <Image
                source={require("../../assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Category Selector */}
            <View style={styles.categorySection}>
              <TouchableOpacity
                style={styles.categorySelector}
                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                <Text weight="semibold" style={styles.categorySelectorText}>
                  {selectedCategory}
                </Text>
                <Ionicons
                  name={showCategoryDropdown ? "chevron-down" : "chevron-up"}
                  size={20}
                  color="#333"
                />
              </TouchableOpacity>

              {showCategoryDropdown && (
                <View style={styles.categoryDropdown}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryOption,
                        category === selectedCategory &&
                          styles.selectedCategoryOption
                      ]}
                      onPress={() => {
                        setSelectedCategory(category);
                        setShowCategoryDropdown(false);
                      }}
                    >
                      <Text
                        weight={
                          category === selectedCategory ? "semibold" : "regular"
                        }
                        style={[
                          styles.categoryOptionText,
                          category === selectedCategory &&
                            styles.selectedCategoryText
                        ]}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Sort By Section */}
            <View style={styles.sortSection}>
              <TouchableOpacity
                style={styles.sortSelector}
                onPress={() => setShowSortDropdown(!showSortDropdown)}
              >
                <Text weight="semibold" style={styles.sortSelectorText}>
                  {getSortLabel()}
                </Text>
                <Ionicons
                  name={showSortDropdown ? "chevron-down" : "chevron-up"}
                  size={20}
                  color="#333"
                />
              </TouchableOpacity>

              {showSortDropdown && (
                <View style={styles.sortDropdown}>
                  {sortOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.sortOption,
                        sortBy === option.value && styles.selectedSortOption
                      ]}
                      onPress={() => {
                        setSortBy(option.value);
                        setShowSortDropdown(false);
                      }}
                    >
                      <Text
                        weight={
                          sortBy === option.value ? "semibold" : "regular"
                        }
                        style={[
                          styles.sortOptionText,
                          sortBy === option.value && styles.selectedSortText
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Search Section */}
            <View style={styles.searchSection}>
              <View style={styles.searchInputContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search..."
                  value={searchText}
                  onChangeText={setSearchText}
                  placeholderTextColor="#999"
                  onSubmitEditing={handleSearch}
                  returnKeyType="search"
                />
                {searchText.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => {
                      setSearchText("");
                      setActiveSearchText("");
                    }}
                  >
                    <Text style={styles.clearButtonText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity
                style={[
                  styles.searchButton,
                  searchText.trim()
                    ? styles.searchButtonActive
                    : styles.searchButtonInactive
                ]}
                onPress={handleSearch}
                disabled={!searchText.trim()}
              >
                <Text
                  weight="semibold"
                  style={[
                    styles.searchButtonText,
                    searchText.trim() && styles.searchButtonTextActive
                  ]}
                >
                  Search
                </Text>
              </TouchableOpacity>
            </View>

            {/* Movies List */}
            <View style={styles.moviesSection}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#5cb3cc" />
                  <Text weight="regular" style={styles.loadingText}>
                    Loading movies...
                  </Text>
                </View>
              ) : error ? (
                <View style={styles.errorContainer}>
                  <Text weight="regular" style={styles.errorText}>
                    Error: {error}
                  </Text>
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={refreshMovies}
                  >
                    <Text style={styles.retryButtonText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              ) : sortedMovies.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="film-outline" size={64} color="#ccc" />
                  <Text weight="semibold" style={styles.emptyTitle}>
                    No movies found
                  </Text>
                  <Text weight="regular" style={styles.emptyText}>
                    Try adjusting your search
                  </Text>
                </View>
              ) : (
                sortedMovies.map((movie) => (
                  <TouchableOpacity
                    key={movie.id}
                    style={styles.movieCard}
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
                      <Text style={styles.movieTitle}>{movie.title}</Text>
                      <Text style={styles.movieDate}>
                        {formatDate(movie.release_date)}
                      </Text>
                      <Text numberOfLines={2} style={styles.movieDescription}>
                        {movie.overview}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  logo: { width: 80, height: 60 },
  scrollView: {
    flex: 1
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#fff"
  },
  categorySection: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
    borderColor: "#E3E3E3",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  categorySelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16
  },
  categorySelectorText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333"
  },
  categoryDropdown: {
    borderTopWidth: 1,
    borderTopColor: "#E3E3E3",
    paddingTop: 24,
    paddingBottom: 16
  },
  categoryOption: {
    backgroundColor: "#F8F8F8",
    padding: 16,
    borderRadius: 6,
    marginBottom: 8,
    marginHorizontal: 16
  },
  selectedCategoryOption: {
    backgroundColor: "#5cb3cc"
  },
  categoryOptionText: {
    fontSize: 16,
    color: "#333"
  },
  selectedCategoryText: {
    color: "#fff",
    fontWeight: "500"
  },
  sortSection: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
    borderColor: "#E3E3E3",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  sortSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16
  },
  sortSelectorText: {
    fontSize: 16,
    color: "#333"
  },
  sortDropdown: {
    borderTopWidth: 1,
    borderTopColor: "#E3E3E3",
    paddingTop: 24,
    paddingBottom: 16
  },
  sortOption: {
    backgroundColor: "#F8F8F8",
    padding: 16,
    borderRadius: 6,
    marginBottom: 8,
    marginHorizontal: 16
  },
  selectedSortOption: {
    backgroundColor: "#5cb3cc"
  },
  sortOptionText: {
    fontSize: 16,
    color: "#333"
  },
  selectedSortText: {
    color: "#fff",
    fontWeight: "500"
  },
  sortText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333"
  },
  searchSection: {
    marginHorizontal: 20,
    marginBottom: 20
  },
  searchInputContainer: {
    position: "relative",
    marginBottom: 20
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    paddingRight: 48, // Make room for clear button
    fontSize: 16,
    elevation: 2,
    borderColor: "#E3E3E3",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  clearButton: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -12 }], // Center vertically
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center"
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 16
  },
  searchButton: {
    borderRadius: 25,
    padding: 16,
    marginBottom: 20,
    alignItems: "center"
  },
  searchButtonInactive: {
    backgroundColor: "#E4E4E4"
  },
  searchButtonActive: {
    backgroundColor: "#5cb3cc"
  },
  searchButtonText: {
    color: "#00000080",
    fontSize: 16,
    fontWeight: "500"
  },
  searchButtonTextActive: {
    color: "#fff"
  },
  moviesSection: {
    marginHorizontal: 20
  },
  movieCard: {
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
    shadowRadius: 4
  },
  moviePoster: {
    width: 96,
    height: 140,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6
  },
  movieInfo: {
    padding: 16,
    flex: 1
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "bold",
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
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40
  },
  errorText: {
    fontSize: 16,
    color: "#ff6b6b",
    textAlign: "center",
    marginBottom: 20
  },
  retryButton: {
    backgroundColor: "#5cb3cc",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500"
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
  }
});
