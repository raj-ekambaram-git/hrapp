import { applyMiddleware, createStore } from "redux";
import storage from 'redux-persist/lib/storage';
import { createWrapper } from "next-redux-wrapper";
import rootSaga from './rootSaga';
import rootReducer from './rootReducer';
import createSagaMiddleware from "@redux-saga/core";
import {persistReducer, persistStore} from "redux-persist";

const invokeMiddleware = (sagaMiddleware) => 
    process.env.ENV != 'production'
      ? applyMiddleware(sagaMiddleware)
      : applyMiddleware(sagaMiddleware);

export const makeStore = ({isServer}) => {
  const sagaMiddleware = createSagaMiddleware();

  if(isServer) {
    const serverState = createStore( rootReducer, invokeMiddleware(sagaMiddleware));
    sagaMiddleware.run(rootSaga);
    return serverState;

  } else {
    const persistConfig = {
      key:'root',
      storage,
      whitelist: ['login'],
      blacklist: []
    }
    const persistedReducer = persistReducer(persistConfig, rootReducer);
    const store = createStore(persistedReducer, invokeMiddleware(sagaMiddleware));
    sagaMiddleware.run(rootSaga);
    store.__persistor = persistStore(store);
    return store;

  }
};


export const wrapper = createWrapper(makeStore);