import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../services/api";
import { Book } from "../types/book";

interface BookCardProps {
  book: Book;
  onDelete?: () => void;
  onUpdate?: () => void;
}

export default function BookCard({ book, onDelete, onUpdate }: BookCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleViewDetails = () => {
    router.push({
      pathname: "/(tabs)/details",
      params: { bookId: book.id },
    });
  };

  const handleEdit = () => {
    router.push({
      pathname: "/(tabs)/edit",
      params: { bookId: book.id },
    });
  };

  const handleToggleRead = async () => {
    try {
      setIsLoading(true);
      await api.put(`/books/${book.id}`, {
        ...book,
        read: !book.read,
      });
      onUpdate?.();
    } catch (err) {
      Alert.alert("Erreur", "Impossible de mettre à jour le statut du livre");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      await api.put(`/books/${book.id}`, {
        ...book,
        favorite: !book.favorite,
      });
      onUpdate?.();
    } catch (err) {
      Alert.alert("Erreur", "Impossible de mettre à jour le favori");
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmer la suppression",
      `Êtes-vous sûr de vouloir supprimer "${book.name}" ?`,
      [
        { text: "Annuler", onPress: () => {}, style: "cancel" },
        {
          text: "Supprimer",
          onPress: async () => {
            try {
              await api.delete(`/books/${book.id}`);
              onDelete?.();
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

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handleViewDetails}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        {/* Image Section */}
        <View style={styles.imageSection}>
          {book.cover ? (
            <Image source={{ uri: book.cover }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>?</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.favoriteButtonFixed}
            onPress={(e) => {
              e.stopPropagation?.();
              handleToggleFavorite();
            }}
          >
            <FontAwesome
              name={book.favorite ? "heart" : "heart-o"}
              size={20}
              color={book.favorite ? "#e91e63" : "#fff"}
            />
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.title} numberOfLines={2}>
            {book.name}
          </Text>
          <Text style={styles.author} numberOfLines={1}>
            {book.author}
          </Text>

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Année</Text>
              <Text style={styles.detailValue}>{book.year}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Thème</Text>
              <Text style={styles.detailValue} numberOfLines={1}>
                {book.theme}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Note</Text>
              <Text style={styles.detailValue}>{book.rating}/5</Text>
            </View>
          </View>

          <View style={styles.statusSection}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: book.read ? "#e8f5e9" : "#ffebee",
                },
              ]}
            >
              <FontAwesome
                name={book.read ? "check-circle" : "circle-o"}
                size={14}
                color={book.read ? "#4caf50" : "#f44336"}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: book.read ? "#4caf50" : "#f44336" },
                ]}
              >
                {book.read ? "Lu" : "Non lu"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Actions Section */}
      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={[styles.actionButton, book.read && styles.actionButtonActive]}
          onPress={(e) => {
            e.stopPropagation?.();
            handleToggleRead();
          }}
          disabled={isLoading}
        >
          <FontAwesome
            name={book.read ? "check-circle" : "circle-o"}
            size={16}
            color={book.read ? "#4caf50" : "#999"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={(e) => {
            e.stopPropagation?.();
            handleEdit();
          }}
        >
          <FontAwesome name="pencil" size={16} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={(e) => {
            e.stopPropagation?.();
            handleDelete();
          }}
        >
          <FontAwesome name="trash" size={16} color="#d32f2f" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  cardContent: {
    flexDirection: "row",
    padding: 12,
    gap: 12,
  },
  imageSection: {
    position: "relative",
  },
  image: {
    width: 70,
    height: 105,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
  },
  imagePlaceholder: {
    width: 70,
    height: 105,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 32,
    color: "#999",
    fontWeight: "bold",
  },
  favoriteButtonFixed: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  infoSection: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
    color: "#333",
  },
  author: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    color: "#999",
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },
  statusSection: {
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  actionsSection: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 0,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#f0f0f0",
  },
  actionButtonActive: {
    backgroundColor: "#f0f8f0",
  },
  meta: {
    fontSize: 11,
    color: "#999",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 4,
  },
  statusRow: {
    marginTop: 4,
  },
  status: {
    fontSize: 12,
    fontWeight: "600",
  },
  year: {
    fontSize: 12,
    color: "#999",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  favoriteButton: {
    padding: 4,
    marginLeft: 8,
  },
});
