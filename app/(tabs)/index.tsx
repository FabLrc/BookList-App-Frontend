import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import BookCard from "../../components/BookCard";
import FiltersAndSort from "../../components/FiltersAndSort";
import Logo from "../../components/Logo";
import SearchBar from "../../components/SearchBar";
import SyncIndicator from "../../components/SyncIndicator";
import SyncNotification from "../../components/SyncNotification";
import { spacing } from "../../constants/designSystem";
import { useNetwork } from "../../context/NetworkContext";
import { useTheme } from "../../context/ThemeContext";
import { hybridApi, setOnlineMode } from "../../services/hybridApi";
import { Book } from "../../types/book";

type FilterType = "all" | "read" | "unread" | "favorite";
type SortType = "title" | "author" | "theme";

export default function HomeScreen() {
  const theme = useTheme();
  const { isOnline, onSyncComplete } = useNetwork();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [activeSort, setActiveSort] = useState<SortType | undefined>(undefined);

  useEffect(() => {
    setOnlineMode(isOnline);
  }, [isOnline]);

  useEffect(() => {
    const handleSyncComplete = () => {
      console.log("📱 Synchronisation terminée, actualisation de la liste");
      fetchBooks(activeFilter, activeSort);
    };
    onSyncComplete(handleSyncComplete);
  }, [activeFilter, activeSort]);

  useFocusEffect(
    useCallback(() => {
      fetchBooks(activeFilter, activeSort);
    }, [activeFilter, activeSort])
  );

  const fetchBooks = async (filter?: FilterType, sort?: SortType) => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, string | boolean> = {};

      // Ajouter le filtre
      if (filter && filter !== "all") {
        if (filter === "read") {
          params.read = true;
        } else if (filter === "unread") {
          params.read = false;
        } else if (filter === "favorite") {
          params.favorite = true;
        }
      }

      // Ajouter le tri
      if (sort) {
        params.sort = sort;
      }

      const data = await hybridApi.getBooks(params);
      setBooks(data);
    } catch (err) {
      setError("Erreur lors du chargement des livres");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      // Si la recherche est vide, recharger avec les filtres actuels
      fetchBooks(activeFilter, activeSort);
      return;
    }

    try {
      setSearching(true);
      setError(null);
      const params: Record<string, string | boolean> = { q: query };

      // Ajouter le filtre même en recherche
      if (activeFilter && activeFilter !== "all") {
        if (activeFilter === "read") {
          params.read = true;
        } else if (activeFilter === "unread") {
          params.read = false;
        } else if (activeFilter === "favorite") {
          params.favorite = true;
        }
      }

      // Ajouter le tri même en recherche
      if (activeSort) {
        params.sort = activeSort;
      }

      const data = await hybridApi.getBooks(params);
      setBooks(data);
    } catch (err) {
      setError("Erreur lors de la recherche");
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const handleFilter = (filter: FilterType) => {
    setActiveFilter(filter);
    setSearchQuery("");
  };

  const handleSort = (sort: SortType) => {
    setActiveSort(sort);
  };

  const handleBookDeleted = () => {
    fetchBooks(activeFilter, activeSort);
  };

  const handleBookUpdated = () => {
    fetchBooks(activeFilter, activeSort);
  };

  if (loading) {
    return (
      <View
        style={[styles.centered, { backgroundColor: theme.theme.background }]}
      >
        <Logo size="medium" />
        <ActivityIndicator
          size="large"
          color={theme.theme.primary}
          style={styles.loader}
        />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[styles.centered, { backgroundColor: theme.theme.background }]}
      >
        <Text style={{ color: theme.theme.error }}>{error}</Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.theme.background }]}
    >
      <SyncNotification />
      <SearchBar onSearch={handleSearch} searching={searching} />
      <FiltersAndSort
        onFilter={handleFilter}
        onSort={handleSort}
        activeFilter={activeFilter}
        activeSort={activeSort}
      />
      <SyncIndicator />

      {books.length === 0 && !loading && !searching && (
        <View style={styles.emptyState}>
          <Logo size="large" />
          <Text style={[styles.emptyStateTitle, { color: theme.theme.text }]}>
            Bienvenue dans BookList
          </Text>
          <Text
            style={[
              styles.emptyStateSubtitle,
              { color: theme.theme.textSecondary },
            ]}
          >
            {searchQuery
              ? "Aucun livre trouvé"
              : "Commencez à ajouter des livres à votre bibliothèque"}
          </Text>
        </View>
      )}

      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <BookCard
            book={item}
            onDelete={handleBookDeleted}
            onUpdate={handleBookUpdated}
          />
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: spacing.lg,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.xl,
  },
  loader: {
    marginTop: spacing.xl,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  emptyStateTitle: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginTop: spacing.lg,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: spacing.sm,
    lineHeight: 24,
  },
});
