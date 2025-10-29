import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../../services/api";
import { Book } from "../../types/book";

export default function BookDetailsScreen() {
  const { bookId } = useLocalSearchParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

  const fetchBook = async () => {
    if (!bookId) {
      setError("ID du livre manquant");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/books/${bookId}`);
      setBook(response.data);
    } catch (err) {
      setError("Erreur lors du chargement du livre");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push({
      pathname: "/(tabs)/edit",
      params: { bookId: book?.id },
    });
  };

  const handleToggleRead = async () => {
    if (!book) return;
    try {
      await api.put(`/books/${book.id}`, {
        ...book,
        read: !book.read,
      });
      setBook({ ...book, read: !book.read });
    } catch (err) {
      Alert.alert("Erreur", "Impossible de mettre à jour le statut");
      console.error(err);
    }
  };

  const handleToggleFavorite = async () => {
    if (!book) return;
    try {
      await api.put(`/books/${book.id}`, {
        ...book,
        favorite: !book.favorite,
      });
      setBook({ ...book, favorite: !book.favorite });
    } catch (err) {
      Alert.alert("Erreur", "Impossible de mettre à jour le favori");
      console.error(err);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmer la suppression",
      `Êtes-vous sûr de vouloir supprimer "${book?.name}" ?`,
      [
        { text: "Annuler", onPress: () => {}, style: "cancel" },
        {
          text: "Supprimer",
          onPress: async () => {
            try {
              await api.delete(`/books/${book?.id}`);
              router.back();
            } catch (err) {
              Alert.alert("Erreur", "Impossible de supprimer le livre");
              console.error(err);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

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
      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{book.name}</Text>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleToggleFavorite}
          >
            <FontAwesome
              name={book.favorite ? "heart" : "heart-o"}
              size={24}
              color={book.favorite ? "#e91e63" : "#999"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Auteur</Text>
          <Text style={styles.value}>{book.author}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Éditeur</Text>
          <Text style={styles.value}>{book.editor}</Text>
        </View>

        <View style={styles.rowSection}>
          <View style={styles.halfSection}>
            <Text style={styles.label}>Année</Text>
            <Text style={styles.value}>{book.year}</Text>
          </View>
          <View style={styles.halfSection}>
            <Text style={styles.label}>Thème</Text>
            <Text style={styles.value}>{book.theme}</Text>
          </View>
        </View>

        <View style={styles.rowSection}>
          <View style={styles.halfSection}>
            <Text style={styles.label}>Note</Text>
            <Text style={styles.value}>{book.rating}/5</Text>
          </View>
          <View style={styles.halfSection}>
            <Text style={styles.label}>Statut</Text>
            <Text
              style={[
                styles.value,
                { color: book.read ? "#4caf50" : "#f44336" },
              ]}
            >
              {book.read ? "Lu" : "Non lu"}
            </Text>
          </View>
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={[styles.actionButton, styles.readButton]}
            onPress={handleToggleRead}
          >
            <FontAwesome
              name={book.read ? "check-circle" : "circle-o"}
              size={20}
              color="#fff"
            />
            <Text style={styles.actionButtonText}>
              {book.read ? "Marquer comme non lu" : "Marquer comme lu"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={handleEdit}
          >
            <FontAwesome name="pencil" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Modifier</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <FontAwesome name="trash" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    gap: 16,
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 16,
  },
  content: {
    padding: 16,
  },
  titleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  favoriteButton: {
    padding: 8,
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  rowSection: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  halfSection: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
  },
  label: {
    fontSize: 12,
    color: "#999",
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  actionsSection: {
    marginTop: 24,
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  readButton: {
    backgroundColor: "#4caf50",
  },
  editButton: {
    backgroundColor: "#007AFF",
  },
  deleteButton: {
    backgroundColor: "#d32f2f",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
