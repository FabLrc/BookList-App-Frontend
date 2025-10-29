import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../services/api";
import { storageService } from "../services/storage";

interface NetworkContextType {
  isOnline: boolean;
  toggleOnlineMode: () => void;
  isSyncing: boolean;
  syncData: () => Promise<void>;
  onSyncComplete: ((callback: () => void) => void) & { callback?: () => void };
  lastSyncTime: number;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

const ONLINE_MODE_KEY = "@online_mode";

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(0);
  const [syncCompleteCallback, setSyncCompleteCallback] = useState<
    (() => void) | null
  >(null);

  useEffect(() => {
    loadOnlineMode();
  }, []);

  const loadOnlineMode = async () => {
    try {
      const saved = await AsyncStorage.getItem(ONLINE_MODE_KEY);
      if (saved !== null) {
        setIsOnline(saved === "true");
      }
    } catch (error) {
      console.error("Erreur lors du chargement du mode en ligne:", error);
    }
  };

  const toggleOnlineMode = async () => {
    try {
      const newMode = !isOnline;
      setIsOnline(newMode);
      await AsyncStorage.setItem(ONLINE_MODE_KEY, newMode.toString());

      if (newMode) {
        await syncData();
      }
    } catch (error) {
      console.error("Erreur lors du changement de mode:", error);
    }
  };

  const syncData = async () => {
    if (!isOnline || isSyncing) return;

    try {
      setIsSyncing(true);
      console.log("🔄 Début de la synchronisation...");

      const syncQueue = await storageService.getSyncQueue();

      if (syncQueue.length === 0) {
        console.log("✅ Aucune donnée à synchroniser");
        const response = await api.get("/books");
        await storageService.saveBooks(response.data);
      } else {
        console.log(`📋 ${syncQueue.length} actions à synchroniser`);

        for (const action of syncQueue) {
          try {
            switch (action.type) {
              case "create":
                await api.post("/books", action.data);
                break;
              case "update":
                await api.put(`/books/${action.data.id}`, action.data);
                break;
              case "delete":
                await api.delete(`/books/${action.data.id}`);
                break;
              case "add_note":
                await api.post(`/books/${action.data.bookId}/notes`, {
                  content: action.data.content,
                });
                break;
              case "delete_note":
                await api.delete(
                  `/books/${action.data.bookId}/notes/${action.data.noteId}`
                );
                break;
            }
          } catch (error) {
            console.error(
              `Erreur lors de la synchronisation de l'action ${action.type}:`,
              error
            );
          }
        }

        await storageService.clearSyncQueue();

        const response = await api.get("/books");
        await storageService.saveBooks(response.data);

        console.log("✅ Synchronisation terminée avec succès");
      }

      setLastSyncTime(Date.now());

      // Appeler le callback si enregistré
      if (syncCompleteCallback) {
        syncCompleteCallback();
      }
    } catch (error) {
      console.error("❌ Erreur lors de la synchronisation:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const onSyncComplete = useCallback((callback: () => void) => {
    setSyncCompleteCallback(() => callback);
  }, []);

  return (
    <NetworkContext.Provider
      value={{
        isOnline,
        toggleOnlineMode,
        isSyncing,
        syncData,
        onSyncComplete,
        lastSyncTime,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error("useNetwork doit être utilisé dans un NetworkProvider");
  }
  return context;
}
