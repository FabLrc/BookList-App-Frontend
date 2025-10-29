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
import { useTheme } from "../../context/ThemeContext";
import { hybridApi } from "../../services/hybridApi";
import { Book } from "../../types/book";

export default function EditBookScreen() {
  const theme = useTheme();
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
      const data = await hybridApi.getBook(Number(bookId));
      console.log("Book data received:", data);
      setBook(data);
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
      <View
        style={[styles.centered, { backgroundColor: theme.theme.background }]}
      >
        <ActivityIndicator size="large" color={theme.theme.primary} />
      </View>
    );
  }

  if (error || !book) {
    return (
      <View
        style={[styles.centered, { backgroundColor: theme.theme.background }]}
      >
        <Text style={{ color: theme.theme.error }}>
          {error || "Livre introuvable"}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.theme.background }]}
    >
      <BookForm book={book} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
