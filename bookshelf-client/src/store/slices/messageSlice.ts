import { createSlice } from "@reduxjs/toolkit";

type MessageTypes = 
  'Primary' | 
  'Secondary'|
  'Success' |
  'Danger'|
  'Warning'|
  'Info' |
  'Light' |
  'Dark';

export interface Message {
  content: string |null,
  variant: MessageTypes | null
}

const initialState: Message = {content: null, variant: null} ;

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessage: (state, action) => {
      return action.payload;
    },
    clearMessage: () => {
      return initialState;
    },
  },
});

const { reducer, actions } = messageSlice;

export const { setMessage, clearMessage } = actions
export default reducer;
