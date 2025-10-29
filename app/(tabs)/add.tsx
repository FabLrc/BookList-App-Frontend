import { ScrollView, StyleSheet } from "react-native";
import BookForm from "../../components/BookForm";
import { useTheme } from "../../context/ThemeContext";

export default function AddBookScreen() {
  const theme = useTheme();
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.theme.background }]}
    >
      <BookForm />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
