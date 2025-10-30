import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import StarRating from "../../components/StarRating";
import {
  borderRadius,
  fontSize,
  fontWeight,
  iconSize,
  spacing,
} from "../../constants/designSystem";
import { useTheme } from "../../context/ThemeContext";
import { hybridApi } from "../../services/hybridApi";
import { openLibraryService } from "../../services/openLibraryApi";
import { Book, Note } from "../../types/book";

export default function BookDetailsScreen() {
  const { theme } = useTheme();
  const { bookId } = useLocalSearchParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [editionCount, setEditionCount] = useState<number | null>(null);
  const [loadingEditions, setLoadingEditions] = useState(false);

  const fetchBook = useCallback(async () => {
    if (!bookId) {
      setError("ID du livre manquant");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await hybridApi.getBook(Number(bookId));
      setBook(data);
    } catch (err) {
      setError("Erreur lors du chargement du livre");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  const fetchNotes = useCallback(async () => {
    if (!bookId) return;

    try {
      const data = await hybridApi.getNotes(Number(bookId));
      setNotes(data || []);
    } catch (err) {
      console.error("Erreur lors du chargement des commentaires:", err);
    }
  }, [bookId]);

  const fetchEditions = useCallback(async (bookName: string) => {
    try {
      setLoadingEditions(true);
      const count = await openLibraryService.searchByTitle(bookName);
      setEditionCount(count);
    } catch (err) {
      console.error("Erreur lors de la recherche OpenLibrary:", err);
    } finally {
      setLoadingEditions(false);
    }
  }, []);

  useEffect(() => {
    if (bookId) {
      fetchBook();
      fetchNotes();
    }
  }, [bookId, fetchBook, fetchNotes]);

  useEffect(() => {
    if (book?.name) {
      fetchEditions(book.name);
    }
  }, [book?.name]);

  const handleAddNote = async () => {
    if (!noteContent.trim()) {
      Alert.alert("Erreur", "Veuillez entrer un commentaire");
      return;
    }

    try {
      setAddingNote(true);
      await hybridApi.addNote(Number(bookId), noteContent);
      Alert.alert("Succès", "Commentaire ajouté");
      setNoteContent("");
      setShowNoteForm(false);
      await fetchNotes();
    } catch (err) {
      Alert.alert("Erreur", "Impossible d'ajouter le commentaire");
      console.error(err);
    } finally {
      setAddingNote(false);
    }
  };

  const handleDeleteNote = (noteId: number) => {
    Alert.alert(
      "Confirmer la suppression",
      "Êtes-vous sûr de vouloir supprimer ce commentaire ?",
      [
        { text: "Annuler", onPress: () => {}, style: "cancel" },
        {
          text: "Supprimer",
          onPress: async () => {
            try {
              await hybridApi.deleteNote(Number(bookId), noteId);
              await fetchNotes();
            } catch (err) {
              Alert.alert("Erreur", "Impossible de supprimer le commentaire");
              console.error(err);
            }
          },
          style: "destructive",
        },
      ]
    );
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
      await hybridApi.updateBook(book.id, {
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
      await hybridApi.updateBook(book.id, {
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
              if (book?.id) {
                await hybridApi.deleteBook(book.id);
              }
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
      <View style={[styles.centered, { backgroundColor: theme.surface }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (error || !book) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.surface }]}>
        <Text style={[styles.errorText, { color: theme.error }]}>
          {error || "Livre introuvable"}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.surface }]}>
      {book.cover && (
        <View style={styles.coverContainer}>
          <Image source={{ uri: book.cover }} style={styles.coverHeader} />
          <View style={styles.coverOverlay} />
        </View>
      )}

      <View style={styles.content}>
        {/* Header avec titre et badges */}
        <View
          style={[
            styles.headerCard,
            {
              backgroundColor: theme.surfaceSecondary,
              shadowColor: theme.text,
            },
          ]}
        >
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: theme.text }]}>
              {book.name}
            </Text>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={handleToggleFavorite}
            >
              <FontAwesome
                name={book.favorite ? "heart" : "heart-o"}
                size={28}
                color={book.favorite ? theme.favorite : theme.placeholder}
              />
            </TouchableOpacity>
          </View>

          <Text style={[styles.author, { color: theme.textSecondary }]}>
            {book.author}
          </Text>

          {/* Badges */}
          <View style={styles.badgesRow}>
            <View
              style={[
                styles.badge,
                { backgroundColor: book.read ? theme.success : theme.warning },
              ]}
            >
              <FontAwesome
                name={book.read ? "check-circle" : "circle-o"}
                size={14}
                color="#fff"
              />
              <Text style={styles.badgeText}>
                {book.read ? "Lu" : "Non lu"}
              </Text>
            </View>

            <View
              style={[styles.badge, { backgroundColor: theme.borderLight }]}
            >
              <FontAwesome name="book" size={14} color={theme.textSecondary} />
              <Text
                style={[styles.badgeTextDark, { color: theme.textSecondary }]}
              >
                {book.theme}
              </Text>
            </View>
          </View>

          {/* Note */}
          <View style={styles.ratingContainer}>
            <StarRating rating={book.rating} size={24} />
            <Text style={[styles.ratingText, { color: theme.text }]}>
              {book.rating}/5
            </Text>
          </View>
        </View>

        {/* Informations détaillées */}
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: theme.surfaceSecondary,
              shadowColor: theme.text,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Informations
          </Text>

          <View
            style={[styles.infoRow, { borderBottomColor: theme.borderLight }]}
          >
            <FontAwesome
              name="building-o"
              size={16}
              color={theme.textSecondary}
            />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textTertiary }]}>
                Éditeur
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {book.editor}
              </Text>
            </View>
          </View>

          <View
            style={[styles.infoRow, { borderBottomColor: theme.borderLight }]}
          >
            <FontAwesome
              name="calendar"
              size={16}
              color={theme.textSecondary}
            />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textTertiary }]}>
                Année de publication
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {book.year}
              </Text>
            </View>
          </View>

          <View
            style={[styles.infoRow, { borderBottomColor: theme.borderLight }]}
          >
            <FontAwesome name="globe" size={16} color={theme.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.textTertiary }]}>
                Éditions référencées
              </Text>
              {loadingEditions ? (
                <ActivityIndicator size="small" color={theme.primary} />
              ) : editionCount !== null ? (
                <Text style={[styles.infoValue, { color: theme.text }]}>
                  {editionCount}
                </Text>
              ) : (
                <Text style={[styles.infoValue, { color: theme.text }]}>
                  Non disponible
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Actions rapides */}
        <View style={styles.actionsCard}>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[
                styles.actionButtonCompact,
                { backgroundColor: theme.success },
              ]}
              onPress={handleToggleRead}
            >
              <FontAwesome
                name={book.read ? "check-circle" : "circle-o"}
                size={18}
                color="#fff"
              />
              <Text style={styles.actionButtonCompactText}>
                {book.read ? "Non lu" : "Lu"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButtonCompact,
                { backgroundColor: theme.primary },
              ]}
              onPress={handleEdit}
            >
              <FontAwesome name="pencil" size={18} color="#fff" />
              <Text style={styles.actionButtonCompactText}>Modifier</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButtonCompact,
                { backgroundColor: theme.error },
              ]}
              onPress={handleDelete}
            >
              <FontAwesome name="trash" size={18} color="#fff" />
              <Text style={styles.actionButtonCompactText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section commentaires */}
        <View
          style={[
            styles.notesCard,
            {
              backgroundColor: theme.surfaceSecondary,
              shadowColor: theme.text,
            },
          ]}
        >
          <View style={styles.notesTitleRow}>
            <FontAwesome name="comment-o" size={20} color={theme.text} />
            <Text style={[styles.notesTitle, { color: theme.text }]}>
              Commentaires ({notes.length})
            </Text>
          </View>

          {notes.length > 0 && (
            <View style={styles.notesList}>
              {notes.map((note) => (
                <View
                  key={note.id}
                  style={[
                    styles.noteItem,
                    {
                      backgroundColor: theme.surface,
                      borderLeftColor: theme.primary,
                    },
                  ]}
                >
                  <View style={styles.noteHeader}>
                    <FontAwesome
                      name="quote-left"
                      size={12}
                      color={theme.textTertiary}
                    />
                  </View>
                  <Text style={[styles.noteContent, { color: theme.text }]}>
                    {note.content}
                  </Text>
                  <TouchableOpacity
                    style={styles.deleteNoteButton}
                    onPress={() => handleDeleteNote(note.id)}
                  >
                    <FontAwesome name="trash-o" size={16} color={theme.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {showNoteForm ? (
            <View style={[styles.noteForm, { backgroundColor: theme.surface }]}>
              <TextInput
                style={[
                  styles.noteInput,
                  {
                    backgroundColor: theme.surfaceSecondary,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="Écrivez votre commentaire..."
                placeholderTextColor={theme.placeholder}
                value={noteContent}
                onChangeText={setNoteContent}
                multiline
                editable={!addingNote}
              />
              <View style={styles.noteFormButtons}>
                <TouchableOpacity
                  style={[
                    styles.formButton,
                    styles.cancelButton,
                    { backgroundColor: theme.borderLight },
                  ]}
                  onPress={() => {
                    setShowNoteForm(false);
                    setNoteContent("");
                  }}
                  disabled={addingNote}
                >
                  <Text
                    style={[
                      styles.cancelButtonText,
                      { color: theme.textSecondary },
                    ]}
                  >
                    Annuler
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.formButton,
                    { backgroundColor: theme.primary },
                  ]}
                  onPress={handleAddNote}
                  disabled={addingNote}
                >
                  {addingNote ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.formButtonText}>Ajouter</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.addNoteButton, { borderColor: theme.primary }]}
              onPress={() => setShowNoteForm(true)}
            >
              <FontAwesome name="plus-circle" size={20} color={theme.primary} />
              <Text
                style={[styles.addNoteButtonText, { color: theme.primary }]}
              >
                Ajouter un commentaire
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
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
    gap: spacing.lg,
  },
  errorText: {
    fontSize: fontSize.base,
  },
  coverContainer: {
    position: "relative",
    width: "100%",
    height: 250,
  },
  coverHeader: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  coverOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    marginTop: -40,
  },
  headerCard: {
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSize.xxl + 2,
    fontWeight: fontWeight.bold,
    flex: 1,
    paddingRight: spacing.md,
  },
  author: {
    fontSize: fontSize.lg,
    marginBottom: spacing.lg,
    fontStyle: "italic",
  },
  favoriteButton: {
    padding: spacing.xs,
  },
  badgesRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
    flexWrap: "wrap",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: borderRadius.sm + 2,
    borderRadius: borderRadius.round,
    gap: borderRadius.sm + 2,
  },
  badgeText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semiBold,
    color: "#fff",
  },
  badgeTextDark: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semiBold,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingTop: spacing.sm,
  },
  ratingText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semiBold,
  },
  infoCard: {
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    gap: spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
  actionsCard: {
    marginBottom: spacing.lg,
  },
  actionsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  actionButtonCompact: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.lg,
    gap: borderRadius.sm + 2,
  },
  actionButtonCompactText: {
    color: "#fff",
    fontSize: fontSize.sm + 1,
    fontWeight: fontWeight.semiBold,
  },
  notesCard: {
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  notesTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs + 2,
    marginBottom: spacing.lg,
  },
  notesTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  notesList: {
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  noteItem: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderLeftWidth: 3,
    position: "relative",
  },
  noteHeader: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
  },
  noteContent: {
    fontSize: fontSize.md + 1,
    lineHeight: 22,
    paddingLeft: iconSize.lg,
    paddingRight: iconSize.lg + spacing.md,
  },
  deleteNoteButton: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    padding: spacing.sm,
  },
  noteForm: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  noteInput: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.md + 1,
    minHeight: 100,
    textAlignVertical: "top",
  },
  noteFormButtons: {
    flexDirection: "row",
    gap: spacing.md,
  },
  formButton: {
    flex: 1,
    padding: spacing.md + 2,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {},
  cancelButtonText: {
    fontSize: fontSize.md + 1,
    fontWeight: fontWeight.semiBold,
  },
  formButtonText: {
    fontSize: fontSize.md + 1,
    fontWeight: fontWeight.semiBold,
    color: "#fff",
  },
  addNoteButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderStyle: "dashed",
    padding: spacing.md + 2,
    borderRadius: borderRadius.lg,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  addNoteButtonText: {
    fontSize: fontSize.md + 1,
    fontWeight: fontWeight.semiBold,
  },
});
