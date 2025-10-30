import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { borderRadius, fontSize, spacing } from "../constants/designSystem";
import { useTheme } from "../context/ThemeContext";

interface SearchBarProps {
  onSearch: (query: string) => void;
  searching?: boolean;
}

export default function SearchBar({
  onSearch,
  searching = false,
}: SearchBarProps) {
  const theme = useTheme();
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
    <View
      style={[
        styles.searchSection,
        {
          backgroundColor: theme.theme.surface,
          borderBottomColor: theme.theme.border,
        },
      ]}
    >
      <View
        style={[
          styles.searchInputContainer,
          { backgroundColor: theme.theme.background },
        ]}
      >
        <FontAwesome
          name="search"
          size={18}
          color={theme.theme.textSecondary}
        />
        <TextInput
          style={[styles.searchInput, { color: theme.theme.text }]}
          placeholder="Rechercher par titre ou auteur..."
          placeholderTextColor={theme.theme.textSecondary}
          value={query}
          onChangeText={handleChangeText}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <FontAwesome
              name="times-circle"
              size={18}
              color={theme.theme.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {searching && (
        <ActivityIndicator size="small" color={theme.theme.primary} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.md,
  },
});
