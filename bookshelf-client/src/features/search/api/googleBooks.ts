import axios from "axios";
import { URLS } from "../../../appConfig";

const BASE_URL = URLS.GOOGLE_BOOKS_URL;
const MAX_RESULTS = 20;

const getResource = (resourceUrl: string) => {
  return axios.get(resourceUrl);
};

export type QueryArgs = {
    searchTerm: string,
    field: string,
    filter: string,
    startIndex: number
}
const googleBooksService = {
  searchBook: ({searchTerm, field, filter='partial', startIndex=0}: QueryArgs) => 
    getResource(
      `${BASE_URL}/volumes?q=${encodeURIComponent(field + ':' + searchTerm)
        .replace(/%20/g, "+")}&filter=${encodeURIComponent(filter)
        .replace(/%20/g, "+")}&maxResults=${MAX_RESULTS}&startIndex=${startIndex}`),
    getBookById: (id: string) => getResource(`${BASE_URL}/volumes/${id}`),
};

export default googleBooksService;