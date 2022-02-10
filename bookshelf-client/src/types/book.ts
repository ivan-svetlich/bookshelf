export default interface Book {
  id: string;
  title: string;
  authors: string;
  publisher: string;
  description: string;
  thumbnail: string;
  productId?: number;
  username?: string;
  count?: number;
}
