/* eslint-disable import/no-import-module-exports */
import {
  configureStore,
} from "@reduxjs/toolkit";
import createSagaMiddleware from 'redux-saga';
import createReducer from './state/reducer';

export default function createStore() {
  const reduxSagaMonitorOptions = {};
  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
  const middlewares = [sagaMiddleware];
  const store = configureStore({
    reducer: createReducer(),
    middleware: middlewares,
  });

  // Extensions
  store.runSaga = sagaMiddleware.run;
  store.injectedReducers = {}; // Reducer registry
  store.injectedSagas = {}; // Saga registry

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('./state/reducer', () => {
      store.replaceReducer(createReducer(store.injectedReducers));
    });
  }

  return store;
}