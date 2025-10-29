import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { storageService } from "../services/storage";

export default function SyncStats() {
  const theme = useTheme();
  const [stats, setStats] = useState({
    localBooks: 0,
    pendingActions: 0,
  });

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    const books = await storageService.getBooks();
    const queue = await storageService.getSyncQueue();
    setStats({
      localBooks: books.length,
      pendingActions: queue.length,
    });
  };

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
      <View style={styles.header}>
        <FontAwesome name="database" size={20} color={theme.theme.primary} />
        <Text style={[styles.title, { color: theme.theme.text }]}>
          Stockage local
        </Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <FontAwesome
            name="book"
            size={16}
            color={theme.theme.textSecondary}
          />
          <Text
            style={[styles.statLabel, { color: theme.theme.textSecondary }]}
          >
            Livres en cache
          </Text>
          <Text style={[styles.statValue, { color: theme.theme.text }]}>
            {stats.localBooks}
          </Text>
        </View>

        <View style={styles.statItem}>
          <FontAwesome
            name="clock-o"
            size={16}
            color={theme.theme.textSecondary}
          />
          <Text
            style={[styles.statLabel, { color: theme.theme.textSecondary }]}
          >
            Actions en attente
          </Text>
          <Text
            style={[
              styles.statValue,
              {
                color:
                  stats.pendingActions > 0
                    ? theme.theme.warning
                    : theme.theme.success,
              },
            ]}
          >
            {stats.pendingActions}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  stats: {
    gap: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statLabel: {
    flex: 1,
    fontSize: 14,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
