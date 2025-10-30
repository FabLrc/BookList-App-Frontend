import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  borderRadius,
  fontSize,
  fontWeight,
  spacing,
} from "../constants/designSystem";
import { useNetwork } from "../context/NetworkContext";
import { useTheme } from "../context/ThemeContext";
import { storageService } from "../services/storage";

export default function SyncIndicator() {
  const theme = useTheme();
  const { isOnline, syncData, isSyncing, lastSyncTime } = useNetwork();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    loadPendingCount();
    const interval = setInterval(loadPendingCount, 1000);
    return () => clearInterval(interval);
  }, [lastSyncTime]);

  const loadPendingCount = async () => {
    const queue = await storageService.getSyncQueue();
    setPendingCount(queue.length);
  };

  if (pendingCount === 0 && !isSyncing) return null;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isOnline
            ? theme.theme.warning + "20"
            : theme.theme.error + "20",
          borderColor: isOnline ? theme.theme.warning : theme.theme.error,
        },
      ]}
      onPress={() => {
        if (isOnline && !isSyncing) {
          syncData();
        }
      }}
      disabled={!isOnline || isSyncing}
    >
      <FontAwesome
        name={isSyncing ? "refresh" : "exclamation-triangle"}
        size={16}
        color={isOnline ? theme.theme.warning : theme.theme.error}
        style={isSyncing ? styles.spinning : undefined}
      />
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.text,
            { color: isOnline ? theme.theme.warning : theme.theme.error },
          ]}
        >
          {isSyncing
            ? "Synchronisation..."
            : `${pendingCount} action${pendingCount > 1 ? "s" : ""} en attente`}
        </Text>
        {isOnline && !isSyncing && (
          <Text style={[styles.hint, { color: theme.theme.textSecondary }]}>
            Appuyez pour synchroniser
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
  },
  hint: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  spinning: {
    transform: [{ rotate: "0deg" }],
  },
});
