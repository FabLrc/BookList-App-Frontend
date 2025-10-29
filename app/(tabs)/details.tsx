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
  }, [book?.name, fetchEditions]);

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
    gap: 16,
  },
  errorText: {
    fontSize: 16,
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
    padding: 16,
    paddingBottom: 32,
    marginTop: -40,
  },
  headerCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    flex: 1,
    paddingRight: 12,
  },
  author: {
    fontSize: 18,
    marginBottom: 16,
    fontStyle: "italic",
  },
  favoriteButton: {
    padding: 4,
  },
  badgesRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  badgeTextDark: {
    fontSize: 12,
    fontWeight: "600",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 8,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: "600",
  },
  infoCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  actionsCard: {
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  actionButtonCompact: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 6,
  },
  actionButtonCompactText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  notesCard: {
    padding: 20,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  notesTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  notesTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  notesList: {
    marginBottom: 16,
    gap: 12,
  },
  noteItem: {
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
    position: "relative",
  },
  noteHeader: {
    position: "absolute",
    top: 12,
    left: 12,
  },
  noteContent: {
    fontSize: 15,
    lineHeight: 22,
    paddingLeft: 24,
    paddingRight: 32,
  },
  deleteNoteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 8,
  },
  noteForm: {
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 8,
  },
  noteInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: "top",
  },
  noteFormButtons: {
    flexDirection: "row",
    gap: 12,
  },
  formButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {},
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  formButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  addNoteButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderStyle: "dashed",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  addNoteButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
