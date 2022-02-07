import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage, clearMessage, Message } from "./messageSlice";
import { IUser } from "../../types/user";
import loginResponseToEntity from "../../utils/mappers/logginResponseMapper";

import AuthService, { LoginArgs } from "../../utils/api/authManagement";
import { fetchBookList } from "./bookListSlice";
import { fetchPurchasedBooks } from "./purchasedBooksSlice";

export interface LoginState {
  loading: boolean,
  user: IUser | null,
  isLoggedIn: boolean,
  error: string | null
};

const initialState: LoginState = {
loading: false,
user: null,
isLoggedIn: false,
error: null
};


export const login = createAsyncThunk<IUser, LoginArgs, {
  rejectValue: string}>(
  'auth/login',
  async (args, thunkAPI) => {
    try{
      const response = await AuthService.login(args);

      thunkAPI.dispatch(clearMessage());
      const user = loginResponseToEntity(response);
      thunkAPI.dispatch(fetchBookList(response.username));
      thunkAPI.dispatch(fetchPurchasedBooks());
      
      return user;
    }
    catch(error: any){
      thunkAPI.dispatch(setMessage({content: error.response.data, variant: 'Danger'}));
      return thunkAPI.rejectWithValue(error.response.data);
    } 
  }
)

export const logout = createAsyncThunk<IUser | null, undefined, {
  rejectValue: string}>(
  'auth/logout',
  async (_, thunkAPI) => {
    try{
      await AuthService.logout().then(() => thunkAPI.dispatch(LOGOUT()));

      return initialState.user;
    }
    catch(error: any){
      thunkAPI.dispatch(setMessage({content: error.response.data, variant: 'Danger'}));

      return thunkAPI.rejectWithValue(error.response.data);
    } 
  }
)

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
      updateUserInfo: (state, action) => {
        state.user = {...state.user, ...action.payload}
      }
    },
    extraReducers: (builder) => {
      builder.addCase(login.pending, (state, { payload }) => {
        state.loading = true;
        state.user = null;
        state.isLoggedIn = false;
        state.error = null;
      });
      builder.addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
        state.isLoggedIn = true;
        state.error = null;
      });
      builder.addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isLoggedIn = false;
        state.error = action.payload ? action.payload : null;
      });
      builder.addCase(logout.pending, (state, { payload }) => {
        state.loading = true;
      });
      builder.addCase(logout.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
        state.isLoggedIn = false;
      });
      builder.addCase(logout.rejected, (state, action) => {
        state.error = action.payload ? action.payload as string : null;
      });
      builder.addDefaultCase((state, action) => state)
      }, 
})

export function LOGOUT(message?: Message) {
  return {
    type: 'LOGOUT',
    payload: message
  }
}

export default loginSlice.reducer;