import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import BookEntry from '../../types/bookEntry';
import bookshelfService from '../../utils/api/books';
import { logout } from './loginSlice';
import { setMessage } from './messageSlice';

export interface BookListState {
    loading: boolean,
    data: BookEntry[] | null,
    error: string[] | null
};

const initialState: BookListState = {
  loading: false,
  data: null,
  error: null
};

export const fetchBookList = createAsyncThunk(
    'bookList/fetchBookList',
    async (username: string) => {
        const response = await bookshelfService.getAll(username);
        return response.data as BookEntry[];
      }
)

export const update = createAsyncThunk<BookEntry, BookEntry, {
    rejectValue: string}>(
    'userListUpdate/update',
    async (data, thunkAPI) => {
        try{
            if(data.id) {
                const response = await bookshelfService.update(data.id, data);

                return response.data;
            }
            else {
                thunkAPI.dispatch(setMessage({content: 'Book ID not available', variant: 'Danger'}));
            
                return thunkAPI.rejectWithValue('Book ID not available')
            }
        }
        catch(error: any){
            if(error.response.status === 401){
                thunkAPI.dispatch(logout());
            }
            thunkAPI.dispatch(setMessage({content: error.response.data, variant: 'Danger'}));
            
            return thunkAPI.rejectWithValue(error.response.data)
        } 
      }
)


export const add = createAsyncThunk<BookEntry, BookEntry, {
    rejectValue: string}>(
    'userListUpdate/add',
    async (data: BookEntry, thunkAPI) => {
        try{
            const response = await bookshelfService.post(data);

            return response.data;
        }
        catch(error: any){
            if(error.response.status === 401){
                thunkAPI.dispatch(logout());
            }
            thunkAPI.dispatch(setMessage({content: error.response.data, variant: 'Danger'}));
            
            return thunkAPI.rejectWithValue(error.response.data)
        } 
    }
)

export const remove = createAsyncThunk(
    'userListUpdate/remove',
    async (id: number, thunkAPI) => {
        try{
            const response = await bookshelfService.remove(id);

            return response.data;
        }
        catch(error: any){
            return thunkAPI.rejectWithValue(error.response.data)
        } 
    }
)

export const bookListSlice = createSlice({
    name: 'bookList',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchBookList.pending, (state, { payload }) => {
            state.loading = true;
            state.data = null;
            state.error = null;
        });
        builder.addCase(fetchBookList.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.data = payload;
            state.error = null;
        });
        builder.addCase(fetchBookList.rejected, (state, action) => {
            state.loading = false;
            state.data = null;
            state.error = ['Bookshelf server error'];
        });
        builder.addCase(update.pending, (state, { payload }) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(update.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.data = updateState(state, payload);
            state.error = null;
        });
        builder.addCase(update.rejected, (state, action) => {
            state.loading = false;
            state.error = ['Bookshelf server error'];
        });
        builder.addCase(add.pending, (state, { payload }) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(add.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.data = state.data ? [...(state.data), payload] : [payload];
            state.error = null;
        });
        builder.addCase(add.rejected, (state, action) => {
            state.loading = false;
            state.error = ['Bookshelf server error'];
        });
        builder.addCase(remove.pending, (state, { payload }) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(remove.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.data = removeFromState(state, payload);
            state.error = null;
        });
        builder.addCase(remove.rejected, (state, action) => {
            state.loading = false;
            state.error = ['Bookshelf server error'];
        });
        builder.addDefaultCase((state, action) => state)
      }, 
})

function updateState(state: BookListState, updatedItem: BookEntry){

    if(state.data){
        return state.data.map(item => item.id === updatedItem.id ? updatedItem : item);
    }

    return [ updatedItem ];
}

function removeFromState(state: BookListState, id: number){

    if(state.data){
        return state.data.filter(item => item.id !== id);
    }
    return null;
}


export default bookListSlice.reducer;