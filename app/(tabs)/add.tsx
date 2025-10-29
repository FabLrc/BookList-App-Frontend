import { useState } from "react";
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

export default function AddBookScreen() {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [editor, setEditor] = useState("");
  const [year, setYear] = useState("");
  const [theme, setTheme] = useState("");
  const [rating, setRating] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddBook = async () => {
    if (!name || !author || !editor || !year || !theme) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      setLoading(true);
      const newBook = {
        name,
        author,
        editor,
        year: parseInt(year),
        theme,
        rating: rating ? parseInt(rating) : 0,
        read: false,
        favorite: false,
        cover: null,
      };

      await api.post("/books", newBook);
      Alert.alert("Succès", "Livre ajouté avec succès");

      setName("");
      setAuthor("");
      setEditor("");
      setYear("");
      setTheme("");
      setRating("");
    } catch (err) {
      Alert.alert("Erreur", "Impossible d'ajouter le livre");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
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

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleAddBook}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Ajouter le livre</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
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
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
