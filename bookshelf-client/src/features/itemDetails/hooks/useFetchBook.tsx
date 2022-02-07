import { useEffect, useReducer } from 'react';
import Book from '../../../types/book';
import bookMapper from '../../../utils/mappers/bookMapper';

export type BookState = {
    loading: boolean,
    data: Book | null,
    error: string | null
}

type ACTION = { type: "LOAD", payload: null } | { type: "SUCCESS"; payload: Book } | { type: "FAILURE", payload: string};

const initialState: BookState = { loading: false, data: null, error: null };

function fetchBookReducer<BookState>(state: BookState, action: ACTION) {
  const { type, payload } = action;

  switch (type) {
    case 'LOAD':
      return { ...state, loading: true, data: null, error: null };
    case 'SUCCESS':
      return { ...state, loading: false, data: payload, error: null };
    case 'FAILURE':
      return { ...state, loading: false, data: null, error: payload };
    default:
      return state;
  }
};

export const useFetchBook = (
  fetchResource: Function, id: string | undefined): BookState => {
    const [state, dispatch] = useReducer(fetchBookReducer, initialState);

    useEffect(() => {
      if(id) {
        fetchBook(fetchResource, id, dispatch);
      }
      return () => {
      };
      
    }, [fetchResource, id])

    return state as BookState;
}

async function fetchBook(fetchResource: Function, id: string, dispatch: React.Dispatch<ACTION>) {
    dispatch({ type: 'LOAD', payload: null });
    try {
      await fetchResource(id)
        .then((res: any) => bookMapper(res.data))
        .then((data: Book) => dispatch({ type: 'SUCCESS', payload: data }));
    }
    catch (error: any) {
        dispatch({ type: 'FAILURE', payload: error.response.data });
    }

}