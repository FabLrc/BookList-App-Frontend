import { ScrollView, StyleSheet, View } from "react-native";
import OfflineToggle from "../../components/OfflineToggle";
import SyncStats from "../../components/SyncStats";
import ThemeToggle from "../../components/ThemeToggle";
import { spacing } from "../../constants/designSystem";
import { useTheme } from "../../context/ThemeContext";

export default function SettingsScreen() {
  const { theme } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.section}>
        <ThemeToggle />
      </View>
      <View style={styles.section}>
        <OfflineToggle />
      </View>
      <View style={styles.section}>
        <SyncStats />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginVertical: spacing.lg,
  },
});
