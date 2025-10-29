import AsyncStorage from "@react-native-async-storage/async-storage";
import { Book } from "../types/book";

const BOOKS_STORAGE_KEY = "@books_local";
const SYNC_QUEUE_KEY = "@sync_queue";

export interface SyncAction {
  id: string;
  type: "create" | "update" | "delete" | "add_note" | "delete_note";
  data: any;
  timestamp: number;
}

export const storageService = {
  async saveBooks(books: Book[]): Promise<void> {
    try {
      await AsyncStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(books));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des livres:", error);
    }
  },

  async getBooks(): Promise<Book[]> {
    try {
      const data = await AsyncStorage.getItem(BOOKS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Erreur lors du chargement des livres:", error);
      return [];
    }
  },

  async addBook(book: Book): Promise<void> {
    try {
      const books = await this.getBooks();
      books.push(book);
      await this.saveBooks(books);
    } catch (error) {
      console.error("Erreur lors de l'ajout du livre:", error);
    }
  },

  async updateBook(updatedBook: Book): Promise<void> {
    try {
      const books = await this.getBooks();
      const index = books.findIndex((b) => b.id === updatedBook.id);
      if (index !== -1) {
        books[index] = updatedBook;
        await this.saveBooks(books);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du livre:", error);
    }
  },

  async deleteBook(bookId: number): Promise<void> {
    try {
      const books = await this.getBooks();
      const filtered = books.filter((b) => b.id !== bookId);
      await this.saveBooks(filtered);
    } catch (error) {
      console.error("Erreur lors de la suppression du livre:", error);
    }
  },

  async addToSyncQueue(action: SyncAction): Promise<void> {
    try {
      const queue = await this.getSyncQueue();
      queue.push(action);
      await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error(
        "Erreur lors de l'ajout à la file de synchronisation:",
        error
      );
    }
  },

  async getSyncQueue(): Promise<SyncAction[]> {
    try {
      const data = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(
        "Erreur lors du chargement de la file de synchronisation:",
        error
      );
      return [];
    }
  },

  async clearSyncQueue(): Promise<void> {
    try {
      await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify([]));
    } catch (error) {
      console.error(
        "Erreur lors du nettoyage de la file de synchronisation:",
        error
      );
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(BOOKS_STORAGE_KEY);
      await AsyncStorage.removeItem(SYNC_QUEUE_KEY);
    } catch (error) {
      console.error("Erreur lors du nettoyage du storage:", error);
    }
  },
};
