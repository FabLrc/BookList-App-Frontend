import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet, Switch, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, mode, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.content}>
        <FontAwesome
          name={mode === "light" ? "sun-o" : "moon-o"}
          size={24}
          color={theme.primary}
        />
        <Text style={[styles.label, { color: theme.text }]}>
          Mode {mode === "light" ? "Clair" : "Sombre"}
        </Text>
      </View>
      <Switch
        value={mode === "dark"}
        onValueChange={toggleTheme}
        trackColor={{ false: theme.border, true: theme.primary }}
        thumbColor={theme.surfaceSecondary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
});
