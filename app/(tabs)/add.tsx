import { ScrollView, StyleSheet } from "react-native";
import BookForm from "../../components/BookForm";

export default function AddBookScreen() {
  return (
    <ScrollView style={styles.container}>
      <BookForm />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});
