import { createStore, applyMiddleware } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import rootReducer from './rootReducer';
import thunkMiddleware  from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['messages']
};

const persisted = persistReducer(persistConfig, rootReducer);

const composedEnhancer = composeWithDevTools({ trace: true, traceLimit: 25 });

export const store = createStore(persisted, composedEnhancer(applyMiddleware(thunkMiddleware)));

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;