import Book from "../../types/book";

export interface BookFromGoogle {
  id: string;
  volumeInfo: VolumeInfo;
  saleInfo: SaleInfo;
}

interface SaleInfo {
  buyLink: string;
}

interface VolumeInfo {
  title: string;
  authors: string[];
  publisher: string;
  description: string;
  imageLinks: ImageLinks;
}

interface ImageLinks {
  thumbnail: string;
}

function bookMapper(bookFromGoogle: BookFromGoogle) {
  const book: Book = {
    id: bookFromGoogle.id,

    title: bookFromGoogle.volumeInfo.title,

    authors:
      "authors" in bookFromGoogle.volumeInfo
        ? bookFromGoogle.volumeInfo.authors.join(", ")
        : "No data",

    publisher:
      "publisher" in bookFromGoogle.volumeInfo
        ? bookFromGoogle.volumeInfo.publisher
        : "No data",

    description:
      "description" in bookFromGoogle.volumeInfo
        ? bookFromGoogle.volumeInfo.description
        : "No data",

    thumbnail:
      "imageLinks" in bookFromGoogle.volumeInfo
        ? bookFromGoogle.volumeInfo.imageLinks.thumbnail
        : "/no_image.png",
  };
  return book;
}

export default bookMapper;
