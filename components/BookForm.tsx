import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../services/api";
import { Book } from "../types/book";

interface BookFormProps {
  book?: Book;
}

export default function BookForm({ book }: BookFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [editor, setEditor] = useState("");
  const [year, setYear] = useState("");
  const [theme, setTheme] = useState("");
  const [rating, setRating] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (book) {
      setName(book.name);
      setAuthor(book.author);
      setEditor(book.editor);
      setYear(book.year.toString());
      setTheme(book.theme);
      setRating(book.rating.toString());
    }
  }, [book]);

  const handleSubmit = async () => {
    if (!name || !author || !editor || !year || !theme) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      setLoading(true);
      const bookData = {
        name,
        author,
        editor,
        year: parseInt(year),
        theme,
        rating: rating ? parseInt(rating) : 0,
        read: book?.read ?? false,
        favorite: book?.favorite ?? false,
        cover: book?.cover ?? null,
      };

      if (book) {
        await api.put(`/books/${book.id}`, bookData);
        Alert.alert("Succès", "Livre modifié avec succès");
      } else {
        await api.post("/books", bookData);
        Alert.alert("Succès", "Livre ajouté avec succès");
      }

      router.back();
    } catch (err) {
      Alert.alert(
        "Erreur",
        book
          ? "Impossible de modifier le livre"
          : "Impossible d'ajouter le livre"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.form}>
      <Text style={styles.label}>Titre *</Text>
      <TextInput
        style={styles.input}
        placeholder="Titre du livre"
        value={name}
        onChangeText={setName}
        editable={!loading}
      />

      <Text style={styles.label}>Auteur *</Text>
      <TextInput
        style={styles.input}
        placeholder="Auteur"
        value={author}
        onChangeText={setAuthor}
        editable={!loading}
      />

      <Text style={styles.label}>Éditeur *</Text>
      <TextInput
        style={styles.input}
        placeholder="Éditeur"
        value={editor}
        onChangeText={setEditor}
        editable={!loading}
      />

      <Text style={styles.label}>Année *</Text>
      <TextInput
        style={styles.input}
        placeholder="Année"
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
        editable={!loading}
      />

      <Text style={styles.label}>Thème *</Text>
      <TextInput
        style={styles.input}
        placeholder="Thème"
        value={theme}
        onChangeText={setTheme}
        editable={!loading}
      />

      <Text style={styles.label}>Note</Text>
      <TextInput
        style={styles.input}
        placeholder="Note (0-5)"
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
        editable={!loading}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.cancelButton,
            loading && styles.buttonDisabled,
          ]}
          onPress={handleCancel}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {book ? "Modifier" : "Ajouter"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 12,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#e0e0e0",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
});
