import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import BookForm from "../../components/BookForm";
import api from "../../services/api";
import { Book } from "../../types/book";

export default function EditBookScreen() {
  const { bookId } = useLocalSearchParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBook = useCallback(async () => {
    if (!bookId) {
      setError("ID du livre manquant");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("Fetching book with ID:", bookId);
      const response = await api.get(`/books/${bookId}`);
      console.log("Book data received:", response.data);
      setBook(response.data);
    } catch (err) {
      setError("Erreur lors du chargement du livre");
      console.error("Error fetching book:", err);
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    if (bookId) {
      fetchBook();
    }
  }, [bookId, fetchBook]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error || !book) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || "Livre introuvable"}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <BookForm book={book} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 16,
  },
});
