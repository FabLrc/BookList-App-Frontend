import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../../services/api";
import { Book, Note } from "../../types/book";

export default function BookDetailsScreen() {
  const { bookId } = useLocalSearchParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  const fetchBook = useCallback(async () => {
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
  }, [bookId]);

  const fetchNotes = useCallback(async () => {
    if (!bookId) return;

    try {
      const response = await api.get(`/books/${bookId}/notes`);
      setNotes(response.data || []);
    } catch (err) {
      console.error("Erreur lors du chargement des commentaires:", err);
    }
  }, [bookId]);

  useEffect(() => {
    if (bookId) {
      fetchBook();
      fetchNotes();
    }
  }, [bookId, fetchBook, fetchNotes]);

  const handleAddNote = async () => {
    if (!noteContent.trim()) {
      Alert.alert("Erreur", "Veuillez entrer un commentaire");
      return;
    }

    try {
      setAddingNote(true);
      await api.post(`/books/${bookId}/notes`, { content: noteContent });
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
              await api.delete(`/books/${bookId}/notes/${noteId}`);
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

        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>Commentaires ({notes.length})</Text>

          {notes.length > 0 ? (
            <View style={styles.notesList}>
              {notes.map((note) => (
                <View key={note.id} style={styles.noteItem}>
                  <Text style={styles.noteContent}>{note.content}</Text>
                  <TouchableOpacity
                    style={styles.deleteNoteButton}
                    onPress={() => handleDeleteNote(note.id)}
                  >
                    <FontAwesome name="trash-o" size={16} color="#d32f2f" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noNotesText}>
              Aucun commentaire pour le moment
            </Text>
          )}

          {showNoteForm ? (
            <View style={styles.noteForm}>
              <TextInput
                style={styles.noteInput}
                placeholder="Ajouter un commentaire..."
                placeholderTextColor="#999"
                value={noteContent}
                onChangeText={setNoteContent}
                multiline
                editable={!addingNote}
              />
              <View style={styles.noteFormButtons}>
                <TouchableOpacity
                  style={[styles.formButton, styles.cancelButton]}
                  onPress={() => {
                    setShowNoteForm(false);
                    setNoteContent("");
                  }}
                  disabled={addingNote}
                >
                  <Text style={styles.formButtonText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.formButton, styles.submitButton]}
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
              style={styles.addNoteButton}
              onPress={() => setShowNoteForm(true)}
            >
              <FontAwesome name="plus" size={18} color="#fff" />
              <Text style={styles.addNoteButtonText}>
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
    paddingBottom: 32,
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
    marginBottom: 24,
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
  notesSection: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
  },
  notesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  notesList: {
    marginBottom: 16,
    gap: 12,
  },
  noteItem: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noteContent: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  deleteNoteButton: {
    padding: 8,
    marginLeft: 8,
  },
  noNotesText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    marginBottom: 16,
    textAlign: "center",
  },
  noteForm: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#333",
    minHeight: 80,
    textAlignVertical: "top",
  },
  noteFormButtons: {
    flexDirection: "row",
    gap: 12,
  },
  formButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ddd",
  },
  submitButton: {
    backgroundColor: "#007AFF",
  },
  formButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  addNoteButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  addNoteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
