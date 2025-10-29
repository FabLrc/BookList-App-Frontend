import { Book, Note } from "../types/book";
import api from "./api";
import { storageService } from "./storage";

let isOnlineMode = true;

export const setOnlineMode = (mode: boolean) => {
  isOnlineMode = mode;
};

export const getOnlineMode = () => isOnlineMode;

export const hybridApi = {
  async getBooks(params?: Record<string, string | boolean>): Promise<Book[]> {
    if (isOnlineMode) {
      try {
        const response = await api.get("/books", { params });
        await storageService.saveBooks(response.data);
        return response.data;
      } catch (error) {
        console.warn("API non disponible, utilisation des données locales");
        return await storageService.getBooks();
      }
    } else {
      let books = await storageService.getBooks();

      if (params) {
        if (params.q) {
          const query = params.q.toString().toLowerCase();
          books = books.filter(
            (b) =>
              b.name.toLowerCase().includes(query) ||
              b.author.toLowerCase().includes(query)
          );
        }

        if (params.read !== undefined) {
          books = books.filter((b) => b.read === params.read);
        }

        if (params.favorite !== undefined) {
          books = books.filter((b) => b.favorite === params.favorite);
        }

        if (params.theme) {
          books = books.filter((b) => b.theme === params.theme);
        }

        if (params.sort) {
          const sortField = params.sort as string;
          books.sort((a, b) => {
            const aVal = a[sortField as keyof Book];
            const bVal = b[sortField as keyof Book];
            if (typeof aVal === "string" && typeof bVal === "string") {
              return aVal.localeCompare(bVal);
            }
            return 0;
          });
        }
      }

      return books;
    }
  },

  async getBook(id: number): Promise<Book | null> {
    if (isOnlineMode) {
      try {
        const response = await api.get(`/books/${id}`);
        return response.data;
      } catch (error) {
        console.warn("API non disponible, utilisation des données locales");
        const books = await storageService.getBooks();
        return books.find((b) => b.id === id) || null;
      }
    } else {
      const books = await storageService.getBooks();
      return books.find((b) => b.id === id) || null;
    }
  },

  async createBook(book: Omit<Book, "id">): Promise<Book> {
    const newBook: Book = {
      ...book,
      id: Date.now(),
    };

    if (isOnlineMode) {
      try {
        const response = await api.post("/books", book);
        await storageService.addBook(response.data);
        return response.data;
      } catch (error) {
        console.warn("API non disponible, sauvegarde locale");
        await storageService.addBook(newBook);
        await storageService.addToSyncQueue({
          id: `create_${newBook.id}`,
          type: "create",
          data: book,
          timestamp: Date.now(),
        });
        return newBook;
      }
    } else {
      await storageService.addBook(newBook);
      await storageService.addToSyncQueue({
        id: `create_${newBook.id}`,
        type: "create",
        data: book,
        timestamp: Date.now(),
      });
      return newBook;
    }
  },

  async updateBook(id: number, book: Partial<Book>): Promise<Book> {
    const books = await storageService.getBooks();
    const existingBook = books.find((b) => b.id === id);

    if (!existingBook) {
      throw new Error("Livre non trouvé");
    }

    const updatedBook = { ...existingBook, ...book };

    if (isOnlineMode) {
      try {
        const response = await api.put(`/books/${id}`, updatedBook);
        await storageService.updateBook(response.data);
        return response.data;
      } catch (error) {
        console.warn("API non disponible, sauvegarde locale");
        await storageService.updateBook(updatedBook);
        await storageService.addToSyncQueue({
          id: `update_${id}`,
          type: "update",
          data: updatedBook,
          timestamp: Date.now(),
        });
        return updatedBook;
      }
    } else {
      await storageService.updateBook(updatedBook);
      await storageService.addToSyncQueue({
        id: `update_${id}`,
        type: "update",
        data: updatedBook,
        timestamp: Date.now(),
      });
      return updatedBook;
    }
  },

  async deleteBook(id: number): Promise<void> {
    if (isOnlineMode) {
      try {
        await api.delete(`/books/${id}`);
        await storageService.deleteBook(id);
      } catch (error) {
        console.warn("API non disponible, suppression locale");
        await storageService.deleteBook(id);
        await storageService.addToSyncQueue({
          id: `delete_${id}`,
          type: "delete",
          data: { id },
          timestamp: Date.now(),
        });
      }
    } else {
      await storageService.deleteBook(id);
      await storageService.addToSyncQueue({
        id: `delete_${id}`,
        type: "delete",
        data: { id },
        timestamp: Date.now(),
      });
    }
  },

  async getNotes(bookId: number): Promise<Note[]> {
    if (isOnlineMode) {
      try {
        const response = await api.get(`/books/${bookId}/notes`);
        return response.data;
      } catch (error) {
        console.warn("API non disponible");
        return [];
      }
    } else {
      return [];
    }
  },

  async addNote(bookId: number, content: string): Promise<Note> {
    const newNote: Note = {
      id: Date.now(),
      content,
    };

    if (isOnlineMode) {
      try {
        const response = await api.post(`/books/${bookId}/notes`, { content });
        return response.data;
      } catch (error) {
        console.warn("API non disponible, note en attente de sync");
        await storageService.addToSyncQueue({
          id: `add_note_${newNote.id}`,
          type: "add_note",
          data: { bookId, content },
          timestamp: Date.now(),
        });
        return newNote;
      }
    } else {
      await storageService.addToSyncQueue({
        id: `add_note_${newNote.id}`,
        type: "add_note",
        data: { bookId, content },
        timestamp: Date.now(),
      });
      return newNote;
    }
  },

  async deleteNote(bookId: number, noteId: number): Promise<void> {
    if (isOnlineMode) {
      try {
        await api.delete(`/books/${bookId}/notes/${noteId}`);
      } catch (error) {
        console.warn("API non disponible, suppression en attente de sync");
        await storageService.addToSyncQueue({
          id: `delete_note_${noteId}`,
          type: "delete_note",
          data: { bookId, noteId },
          timestamp: Date.now(),
        });
      }
    } else {
      await storageService.addToSyncQueue({
        id: `delete_note_${noteId}`,
        type: "delete_note",
        data: { bookId, noteId },
        timestamp: Date.now(),
      });
    }
  },
};
