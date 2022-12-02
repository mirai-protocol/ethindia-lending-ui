import { combineReducers } from 'redux';
import marketsReducer from './markets';

export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    markets: marketsReducer,
    ...injectedReducers,
  });

  return rootReducer;
}