export interface Book {
  id: number;
  name: string;
  author: string;
  editor: string;
  year: number;
  cover: string | null;
  theme: string;
  read: boolean;
  favorite: boolean;
  rating: number;
}

export interface Note {
  id: number;
  content: string;
}
