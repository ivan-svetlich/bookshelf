import { useEffect, useReducer } from 'react';
import BookEntry from '../../../types/bookEntry';

export type BookState = {
    loading: boolean,
    data: BookEntry[],
    error: string | null
}

type ACTION = { type: "LOAD", payload: null } | { type: "SUCCESS"; payload: BookEntry[] } | { type: "FAILURE", payload: string};

const initialState: BookState = { loading: false, data: [], error: null };

function fetchBooksReducer<BookState>(state: BookState, action: ACTION) {
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

export const useFetchBooks = (
  fetchResource: Function, amount: number): BookState => {
    const [state, dispatch] = useReducer(fetchBooksReducer, initialState);

    useEffect(() => {
      fetchBooks(fetchResource, amount, dispatch);

      return () => {
      };
      
    }, [amount, fetchResource])

    return state as BookState;
}

async function fetchBooks(fetchResource: Function, amount: number, dispatch: React.Dispatch<ACTION>) {
    dispatch({ type: 'LOAD', payload: null });
    try {
        const response = await fetchResource(amount);
        dispatch({ type: 'SUCCESS', payload: response.data });
    }
    catch (error: any) {
        dispatch({ type: 'FAILURE', payload: error.response.data });
    }

}