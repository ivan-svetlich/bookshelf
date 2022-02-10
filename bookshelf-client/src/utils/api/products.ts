import axios from "axios";
import { URLS } from "../../appConfig";
import { getCookie } from "../../services/cookies/cookies";
import { ProductDTO, ProductUpdate } from "../../types/product";
import axiosInstance from "./axiosConfig/axiosConfig";

const PRODUCTS = URLS.BOOKSHELF.PRODUCTS;
const MERCADO_PAGO = URLS.BOOKSHELF.MERCADO_PAGO;

const addProductToStore = async (product: ProductDTO) => {
  return axiosInstance.post(PRODUCTS, product, {
    headers: { Authorization: `Bearer ${getCookie("id_token")}` },
  });
};

const updateProduct = async (product: ProductUpdate) => {
  return axiosInstance.put(PRODUCTS, product, {
    headers: { Authorization: `Bearer ${getCookie("id_token")}` },
  });
};

const removeProduct = async (productId: number) => {
  return axiosInstance.delete(PRODUCTS + `?id=${productId}`, {
    headers: { Authorization: `Bearer ${getCookie("id_token")}` },
  });
};

export type QueryArgs = {
  searchTerm: string;
  field: string;
  filter: string;
  startIndex: number;
};

const searchProducts = async (args: QueryArgs) => {
  return axios.get(
    PRODUCTS +
      `?q=${args.searchTerm}&field=${args.field}&startIndex=${args.startIndex}`
  );
};

const getProductById = async (googleBooksId: string) => {
  return axios.get(PRODUCTS + `${googleBooksId}`);
};

const createPreference = async (id: string) => {
  return axiosInstance.post(
    MERCADO_PAGO + "Preference",
    { productId: id },
    { headers: { Authorization: `Bearer ${getCookie("id_token")}` } }
  );
};

const products = {
  addProductToStore,
  updateProduct,
  removeProduct,
  searchProducts,
  getProductById,
  createPreference,
};

export default products;
