import { FontAwesome } from "@expo/vector-icons";
import {
  ActivityIndicator,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useNetwork } from "../context/NetworkContext";
import { useTheme } from "../context/ThemeContext";

export default function OfflineToggle() {
  const theme = useTheme();
  const { isOnline, toggleOnlineMode, isSyncing } = useNetwork();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.theme.surface,
          borderColor: theme.theme.border,
        },
      ]}
    >
      <View style={styles.left}>
        <FontAwesome
          name={isOnline ? "wifi" : "chain-broken"}
          size={20}
          color={isOnline ? theme.theme.success : theme.theme.error}
        />
        <View style={styles.textContainer}>
          <Text style={[styles.label, { color: theme.theme.text }]}>
            Mode en ligne
          </Text>
          <Text style={[styles.subtitle, { color: theme.theme.textSecondary }]}>
            {isOnline
              ? "Connecté à l'API"
              : "Mode hors ligne - Données locales"}
          </Text>
        </View>
      </View>
      <View style={styles.right}>
        {isSyncing && (
          <ActivityIndicator size="small" color={theme.theme.primary} />
        )}
        <Switch
          value={isOnline}
          onValueChange={toggleOnlineMode}
          trackColor={{
            false: theme.theme.error + "40",
            true: theme.theme.success + "40",
          }}
          thumbColor={isOnline ? theme.theme.success : theme.theme.error}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
