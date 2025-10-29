import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { darkTheme, lightTheme, type Theme } from "../constants/theme";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  toggleTheme: () => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [isLoading, setIsLoading] = useState(true);

  // Load theme preference on startup
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedMode = await AsyncStorage.getItem("themeMode");
      if (savedMode === "dark" || savedMode === "light") {
        setMode(savedMode);
      }
    } catch (err) {
      console.error("Erreur lors du chargement du thème:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newMode = mode === "light" ? "dark" : "light";
      setMode(newMode);
      await AsyncStorage.setItem("themeMode", newMode);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde du thème:", err);
    }
  };

  const theme = mode === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme doit être utilisé dans un ThemeProvider");
  }
  return context;
}
