import axios from "axios";

const openLibraryApi = axios.create({
  baseURL: "https://openlibrary.org/",
});

export interface OpenLibrarySearchResult {
  docs: Array<{
    title: string;
    edition_count?: number;
  }>;
}

export const openLibraryService = {
  searchByTitle: async (title: string): Promise<number | null> => {
    try {
      const response = await openLibraryApi.get<OpenLibrarySearchResult>(
        "/search.json",
        {
          params: {
            title: title,
          },
        }
      );

      if (response.data.docs && response.data.docs.length > 0) {
        const firstResult = response.data.docs[0];
        return firstResult.edition_count || 0;
      }

      return null;
    } catch (error) {
      console.error("Erreur lors de la recherche OpenLibrary:", error);
      return null;
    }
  },
};
