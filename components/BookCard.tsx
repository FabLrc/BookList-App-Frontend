import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  borderRadius,
  fontSize,
  fontWeight,
  iconSize,
  spacing,
} from "../constants/designSystem";
import { useTheme } from "../context/ThemeContext";
import { hybridApi } from "../services/hybridApi";
import { Book } from "../types/book";
import StarRating from "./StarRating";

interface BookCardProps {
  book: Book;
  onDelete?: () => void;
  onUpdate?: () => void;
}

export default function BookCard({ book, onDelete, onUpdate }: BookCardProps) {
  const theme = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [notesCount, setNotesCount] = useState(0);

  const fetchNotesCount = useCallback(async () => {
    try {
      const notes = await hybridApi.getNotes(book.id);
      setNotesCount(notes?.length || 0);
    } catch (err) {
      console.error("Erreur lors du chargement des commentaires:", err);
    }
  }, [book.id]);

  useEffect(() => {
    fetchNotesCount();
  }, [book.id, fetchNotesCount]);

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
      await hybridApi.updateBook(book.id, {
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
      await hybridApi.updateBook(book.id, {
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
              await hybridApi.deleteBook(book.id);
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
      style={[styles.card, { backgroundColor: theme.theme.surface }]}
      onPress={handleViewDetails}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        {/* Image Section */}
        <View style={styles.imageSection}>
          {book.cover ? (
            <Image source={{ uri: book.cover }} style={styles.image} />
          ) : (
            <View
              style={[
                styles.imagePlaceholder,
                { backgroundColor: theme.theme.background },
              ]}
            >
              <Text
                style={{
                  color: theme.theme.textSecondary,
                  fontSize: 32,
                  fontWeight: "bold",
                }}
              >
                ?
              </Text>
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
          <Text
            style={[styles.title, { color: theme.theme.text }]}
            numberOfLines={2}
          >
            {book.name}
          </Text>
          <Text
            style={[styles.author, { color: theme.theme.textSecondary }]}
            numberOfLines={1}
          >
            {book.author}
          </Text>

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Text
                style={[
                  styles.detailLabel,
                  { color: theme.theme.textSecondary },
                ]}
              >
                Année
              </Text>
              <Text style={[styles.detailValue, { color: theme.theme.text }]}>
                {book.year}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text
                style={[
                  styles.detailLabel,
                  { color: theme.theme.textSecondary },
                ]}
              >
                Thème
              </Text>
              <Text
                style={[styles.detailValue, { color: theme.theme.text }]}
                numberOfLines={1}
              >
                {book.theme}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text
                style={[
                  styles.detailLabel,
                  { color: theme.theme.textSecondary },
                ]}
              >
                Note
              </Text>
              <View style={styles.ratingContainer}>
                <StarRating rating={book.rating} size={14} />
                <Text
                  style={[
                    styles.ratingText,
                    { color: theme.theme.textSecondary },
                  ]}
                >
                  ({notesCount})
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.statusSection}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: book.read
                    ? theme.theme.success + "20"
                    : theme.theme.error + "20",
                },
              ]}
            >
              <FontAwesome
                name={book.read ? "check-circle" : "circle-o"}
                size={14}
                color={book.read ? theme.theme.success : theme.theme.error}
              />
              <Text
                style={[
                  styles.statusText,
                  {
                    color: book.read ? theme.theme.success : theme.theme.error,
                  },
                ]}
              >
                {book.read ? "Lu" : "Non lu"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Actions Section */}
      <View
        style={[styles.actionsSection, { borderTopColor: theme.theme.border }]}
      >
        <TouchableOpacity
          style={[
            styles.actionButton,
            { borderRightColor: theme.theme.border },
            book.read && { backgroundColor: theme.theme.background },
          ]}
          onPress={(e) => {
            e.stopPropagation?.();
            handleToggleRead();
          }}
          disabled={isLoading}
        >
          <FontAwesome
            name={book.read ? "check-circle" : "circle-o"}
            size={16}
            color={book.read ? theme.theme.success : theme.theme.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { borderRightColor: theme.theme.border },
          ]}
          onPress={(e) => {
            e.stopPropagation?.();
            handleEdit();
          }}
        >
          <FontAwesome name="pencil" size={16} color={theme.theme.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={(e) => {
            e.stopPropagation?.();
            handleDelete();
          }}
        >
          <FontAwesome name="trash" size={16} color={theme.theme.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  cardContent: {
    flexDirection: "row",
    padding: spacing.md,
    gap: spacing.md,
  },
  imageSection: {
    position: "relative",
  },
  image: {
    width: 70,
    height: 105,
    borderRadius: borderRadius.sm,
  },
  imagePlaceholder: {
    width: 70,
    height: 105,
    borderRadius: borderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButtonFixed: {
    position: "absolute",
    top: borderRadius.sm,
    right: borderRadius.sm,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: borderRadius.lg,
    width: iconSize.lg + spacing.sm,
    height: iconSize.lg + spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  infoSection: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    marginBottom: 2,
  },
  author: {
    fontSize: fontSize.sm + 1,
    marginBottom: spacing.sm,
  },
  detailsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: fontSize.xs - 1,
    textTransform: "uppercase",
    fontWeight: fontWeight.semiBold,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: fontSize.sm + 1,
    fontWeight: fontWeight.medium,
  },
  statusSection: {
    marginTop: spacing.xs,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: borderRadius.sm + 2,
    paddingHorizontal: spacing.sm,
    paddingVertical: borderRadius.sm + 2,
    borderRadius: borderRadius.sm,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semiBold,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: borderRadius.sm + 2,
  },
  ratingText: {
    fontSize: fontSize.sm,
  },
  actionsSection: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingTop: 0,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.xs + 6,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
  },
});
