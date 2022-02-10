import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Product from "../../types/product";
import bookshelfService from "../../utils/api/books";

export interface PurchasedBooksState {
  loading: boolean;
  data: Product[] | null;
  error: string[] | null;
}

const initialState: PurchasedBooksState = {
  loading: false,
  data: null,
  error: null,
};

export const fetchPurchasedBooks = createAsyncThunk(
  "bookList/fetchPurchasedBooks",
  async () => {
    const response = await bookshelfService.getPurchasedBooks();
    return response.data as Product[];
  }
);

export const purchasedBooksSlice = createSlice({
  name: "bookList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPurchasedBooks.pending, (state, { payload }) => {
      state.loading = true;
      state.data = null;
      state.error = null;
    });
    builder.addCase(fetchPurchasedBooks.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.data = payload;
      state.error = null;
    });
    builder.addCase(fetchPurchasedBooks.rejected, (state, action) => {
      state.loading = false;
      state.data = null;
      state.error = ["Bookshelf server error"];
    });
    builder.addDefaultCase((state, action) => state);
  },
});

export default purchasedBooksSlice.reducer;
