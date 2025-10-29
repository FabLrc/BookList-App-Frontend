import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
import { useTheme } from "../context/ThemeContext";
import { hybridApi } from "../services/hybridApi";
import { Book } from "../types/book";

interface BookFormProps {
  book?: Book;
}

export default function BookForm({ book }: BookFormProps) {
  const theme = useTheme();
  const router = useRouter();
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [editor, setEditor] = useState("");
  const [year, setYear] = useState("");
  const [themeValue, setThemeValue] = useState("");
  const [rating, setRating] = useState("");
  const [cover, setCover] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (book) {
      setName(book.name);
      setAuthor(book.author);
      setEditor(book.editor);
      setYear(book.year.toString());
      setThemeValue(book.theme);
      setRating(book.rating.toString());
      setCover(book.cover);
    }
  }, [book]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [2, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setCover(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert("Erreur", "Impossible de sélectionner une image");
      console.error(err);
    }
  };

  const removeImage = () => {
    setCover(null);
  };

  const handleSubmit = async () => {
    if (!name || !author || !editor || !year || !themeValue) {
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
        theme: themeValue,
        rating: rating ? parseInt(rating) : 0,
        read: book?.read ?? false,
        favorite: book?.favorite ?? false,
        cover,
      };

      if (book) {
        await hybridApi.updateBook(book.id, bookData);
        Alert.alert("Succès", "Livre modifié avec succès");
      } else {
        await hybridApi.createBook(bookData);
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
    <ScrollView
      style={[styles.form, { backgroundColor: theme.theme.background }]}
    >
      {/* Image Section */}
      <View style={styles.imageSection}>
        {cover ? (
          <>
            <Image source={{ uri: cover }} style={styles.coverImage} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={removeImage}
            >
              <FontAwesome name="trash" size={16} color="#fff" />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[
              styles.imagePlaceholder,
              {
                borderColor: theme.theme.border,
                backgroundColor: theme.theme.surface,
              },
            ]}
            onPress={pickImage}
            disabled={loading}
          >
            <FontAwesome
              name="image"
              size={48}
              color={theme.theme.textSecondary}
            />
            <Text
              style={[
                styles.imagePlaceholderText,
                { color: theme.theme.textSecondary },
              ]}
            >
              Ajouter une image
            </Text>
          </TouchableOpacity>
        )}
        {cover && (
          <TouchableOpacity
            style={[
              styles.changeImageButton,
              { backgroundColor: theme.theme.primary },
            ]}
            onPress={pickImage}
          >
            <FontAwesome name="edit" size={16} color="#fff" />
            <Text style={styles.changeImageButtonText}>
              Changer l&apos;image
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.label, { color: theme.theme.text }]}>Titre *</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.theme.surface,
            color: theme.theme.text,
            borderColor: theme.theme.border,
          },
        ]}
        placeholder="Titre du livre"
        placeholderTextColor={theme.theme.textSecondary}
        value={name}
        onChangeText={setName}
        editable={!loading}
      />

      <Text style={[styles.label, { color: theme.theme.text }]}>Auteur *</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.theme.surface,
            color: theme.theme.text,
            borderColor: theme.theme.border,
          },
        ]}
        placeholder="Auteur"
        placeholderTextColor={theme.theme.textSecondary}
        value={author}
        onChangeText={setAuthor}
        editable={!loading}
      />

      <Text style={[styles.label, { color: theme.theme.text }]}>Éditeur *</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.theme.surface,
            color: theme.theme.text,
            borderColor: theme.theme.border,
          },
        ]}
        placeholder="Éditeur"
        placeholderTextColor={theme.theme.textSecondary}
        value={editor}
        onChangeText={setEditor}
        editable={!loading}
      />

      <Text style={[styles.label, { color: theme.theme.text }]}>Année *</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.theme.surface,
            color: theme.theme.text,
            borderColor: theme.theme.border,
          },
        ]}
        placeholder="Année"
        placeholderTextColor={theme.theme.textSecondary}
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
        editable={!loading}
      />

      <Text style={[styles.label, { color: theme.theme.text }]}>Thème *</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.theme.surface,
            color: theme.theme.text,
            borderColor: theme.theme.border,
          },
        ]}
        placeholder="Thème"
        placeholderTextColor={theme.theme.textSecondary}
        value={themeValue}
        onChangeText={setThemeValue}
        editable={!loading}
      />

      <Text style={[styles.label, { color: theme.theme.text }]}>Note</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.theme.surface,
            color: theme.theme.text,
            borderColor: theme.theme.border,
          },
        ]}
        placeholder="Note (0-5)"
        placeholderTextColor={theme.theme.textSecondary}
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
            {
              backgroundColor: theme.theme.surface,
              borderColor: theme.theme.border,
            },
            loading && styles.buttonDisabled,
          ]}
          onPress={handleCancel}
          disabled={loading}
        >
          <Text style={[styles.cancelButtonText, { color: theme.theme.text }]}>
            Annuler
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: theme.theme.primary },
            loading && styles.buttonDisabled,
          ]}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  form: {
    padding: 16,
    flexGrow: 1,
  },
  imageSection: {
    marginBottom: 20,
    alignItems: "center",
  },
  coverImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
  },
  imagePlaceholder: {
    width: 120,
    height: 180,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    gap: 8,
  },
  imagePlaceholderText: {
    fontSize: 12,
    textAlign: "center",
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#d32f2f",
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  changeImageButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  changeImageButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
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
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    borderWidth: 1,
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
    fontSize: 16,
    fontWeight: "bold",
  },
});
