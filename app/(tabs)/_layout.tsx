import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import { getTabBarIcon, getTabBarLabel } from "../../utils/tabBarUtils";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#999",
        tabBarShowLabel: true,
        headerShown: true,
        headerTitleStyle: styles.headerTitle,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Mes Livres",
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
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
