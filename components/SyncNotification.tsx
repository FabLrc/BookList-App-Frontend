import { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useNetwork } from "../context/NetworkContext";
import { useTheme } from "../context/ThemeContext";

export default function SyncNotification() {
  const theme = useTheme();
  const { isSyncing, lastSyncTime } = useNetwork();
  const [showNotification, setShowNotification] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isSyncing) {
      setShowNotification(true);
    }
  }, [isSyncing]);

  useEffect(() => {
    if (showNotification) {
      // Animation d'apparition
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      if (!isSyncing) {
        // Garder visible 2 secondes puis disparaître
        const timer = setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => setShowNotification(false));
        }, 2000);

        return () => clearTimeout(timer);
      }
    }
  }, [showNotification, isSyncing, fadeAnim]);

  if (!showNotification) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View
        style={[
          styles.notification,
          {
            backgroundColor: isSyncing
              ? theme.theme.primary + "20"
              : theme.theme.success + "20",
            borderColor: isSyncing ? theme.theme.primary : theme.theme.success,
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              color: isSyncing ? theme.theme.primary : theme.theme.success,
            },
          ]}
        >
          {isSyncing
            ? "🔄 Synchronisation en cours..."
            : "✅ Synchronisation terminée"}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  notification: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
