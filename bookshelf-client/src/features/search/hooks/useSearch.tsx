import { useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Book from '../../../types/book';
import products from '../../../utils/api/products';
import bookMapper, { BookFromGoogle } from '../../../utils/mappers/bookMapper';
import googleBooks, { QueryArgs } from '../api/googleBooks';

export type SearchState = {
    loading: boolean,
    data: Book[] | null,
    error: string | null
}

type ACTION = { type: "LOAD", payload: null } | { type: "SUCCESS"; payload: Book[] } | { type: "FAILURE", payload: string};

const initialState: SearchState = { loading: false, data: null, error: null };

function searchReducer<SearchState>(state: SearchState, action: ACTION) {
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

type UseSearchReturn = {
  searchState: SearchState,
  args: QueryArgs,
  setArgs: React.Dispatch<React.SetStateAction<QueryArgs>>
}

export const useSearch = (
  _args: QueryArgs,
  storeOnly: boolean, 
  timeout: number,  
  //setUpdate: React.Dispatch<React.SetStateAction<boolean>>
  ): UseSearchReturn => {
    const [state, dispatch] = useReducer(searchReducer, initialState);
    const [args, setArgs] = useState(_args);
    const navigate = useNavigate();

    useEffect(() => {
      const timeoutId = setTimeout(async () => {
        if(args.searchTerm) {
          navigate(`/search?q=${encodeURIComponent(args.searchTerm)}&field=${args.field}&store-only=${storeOnly}&start-index=${args.startIndex}`, 
                    { replace: true })
          fetchBooks(storeOnly, args, dispatch);     
        }
      }, timeout);
      return () => {
        clearTimeout(timeoutId);
      }
      
    }, [timeout, args, storeOnly, navigate, _args.searchTerm, _args.field, _args.startIndex])

    return {searchState: (state as SearchState), args, setArgs};
}

async function fetchBooks(storeOnly: boolean, args: QueryArgs, dispatch: React.Dispatch<ACTION>) {
    dispatch({ type: 'LOAD', payload: null });
    try {
      if(storeOnly) {
        const response = await products.searchProducts(args);
        dispatch({ type: 'SUCCESS', payload: response.data });
      }
      else {
        await googleBooks.searchBook(args)
          .then(res => {
            if (res.data.totalItems > 0) {
              return res.data.items.map((item: BookFromGoogle) => bookMapper(item))
            }
            else {
              return [];
            }
          })
          .then(data => dispatch({ type: 'SUCCESS', payload: data }));
      }   
    }
    catch (error: any) {
        dispatch({ type: 'FAILURE', payload: error.response.data });
    }

}