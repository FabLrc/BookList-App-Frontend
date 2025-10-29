import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import BookCard from "../../components/BookCard";
import SearchBar from "../../components/SearchBar";
import api from "../../services/api";
import { Book } from "../../types/book";

export default function HomeScreen() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchBooks();
    }, [])
  );

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/books");
      setBooks(response.data);
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
      // Si la recherche est vide, recharger tous les livres
      fetchBooks();
      return;
    }

    try {
      setSearching(true);
      setError(null);
      const response = await api.get("/books", {
        params: {
          q: query,
        },
      });
      setBooks(response.data);
    } catch (err) {
      setError("Erreur lors de la recherche");
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const handleBookDeleted = () => {
    fetchBooks();
  };

  const handleBookUpdated = () => {
    fetchBooks();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar onSearch={handleSearch} searching={searching} />

      {books.length === 0 && !loading && !searching && (
        <View style={styles.emptyState}>
          <FontAwesome name="inbox" size={48} color="#ccc" />
          <Text style={styles.emptyText}>
            {searchQuery
              ? "Aucun livre trouvé"
              : "Aucun livre dans votre bibliothèque"}
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
    backgroundColor: "#f5f5f5",
  },
  list: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 16,
  },
});
