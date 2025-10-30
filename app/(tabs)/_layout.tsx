import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import Logo from "../../components/Logo";
import { useTheme } from "../../context/ThemeContext";
import { getTabBarIcon, getTabBarLabel } from "../../utils/tabBarUtils";

export default function TabsLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textTertiary,
        tabBarShowLabel: true,
        headerShown: true,
        headerTitleStyle: styles.headerTitle,
        headerStyle: {
          backgroundColor: theme.surface,
        },
        headerTintColor: theme.text,
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: () => (
            <View style={styles.headerTitleContainer}>
              <Logo size="small" />
            </View>
          ),
          tabBarLabel: getTabBarLabel("index"),
          tabBarIcon: ({ color }) => getTabBarIcon("index", color, 24),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Ajouter un Livre",
          tabBarLabel: getTabBarLabel("add"),
          tabBarIcon: ({ color }) => getTabBarIcon("add", color, 24),
        }}
      />
      <Tabs.Screen
        name="edit"
        options={{
          title: "Modifier un Livre",
          href: null,
        }}
      />
      <Tabs.Screen
        name="details"
        options={{
          title: "Détails du Livre",
          href: null,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Statistiques",
          tabBarLabel: getTabBarLabel("stats"),
          tabBarIcon: ({ color }) => getTabBarIcon("stats", color, 24),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Paramètres",
          tabBarLabel: getTabBarLabel("settings"),
          tabBarIcon: ({ color }) => getTabBarIcon("settings", color, 24),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerTitleContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
