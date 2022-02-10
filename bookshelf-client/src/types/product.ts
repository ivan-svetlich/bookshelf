export default interface Product {
  id: number;
  title: string;
  authors: string;
  publisher: string;
  googleBooksId: string;
  price: number;
}

export interface ProductDTO {
  title: string;
  authors: string;
  publisher: string;
  googleBooksId: string;
  price: string;
}

export interface ProductUpdate {
  id: number;
  price: string;
}
