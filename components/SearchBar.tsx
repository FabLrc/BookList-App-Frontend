import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SearchBarProps {
  onSearch: (query: string) => void;
  searching?: boolean;
}

export default function SearchBar({
  onSearch,
  searching = false,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleChangeText = (text: string) => {
    setQuery(text);
    onSearch(text);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <View style={styles.searchSection}>
      <View style={styles.searchInputContainer}>
        <FontAwesome name="search" size={18} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher par titre ou auteur..."
          placeholderTextColor="#ccc"
          value={query}
          onChangeText={handleChangeText}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <FontAwesome name="times-circle" size={18} color="#999" />
          </TouchableOpacity>
        )}
      </View>
      {searching && <ActivityIndicator size="small" color="#007AFF" />}
    </View>
  );
}

const styles = StyleSheet.create({
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
});
