export default interface BookEntry {
  id?: number;
  title: string;
  authors: string | null;
  publisher: string | null;
  status: string | null;
  score: string | null;
  googleBooksId: string;
  username?: string;
  updatedAt?: Date;
  count?: number;
  thumbnail?: string;
}

export interface TopBook {
  googleBooksId: string;
  count: number;
}
