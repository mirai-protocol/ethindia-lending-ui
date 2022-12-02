/* eslint-disable no-case-declarations */
/* eslint-disable consistent-return */
/* eslint-disable default-case */
import produce from 'immer';
import { createActions } from 'reduxsauce';

export const { Types: globalTypes, Creators: globalCreators } = createActions({
  getMarketsLoad: ['data'],
  getMarketsSuccess: ['data'],
  getMarketsError: ['error'],
  setMarketsStats: ['data'],
  getTopMarketsLoad: ['data'],
  getTopMarketsSuccess: ['data'],
  getTopMarketsError: ['error'],
  getDailyProtocolDataLoad: ['data'],
  getDailyProtocolDataSuccess: ['data'],
  getDailyProtocolDataError: ['error'],
  updateMarket: ['data'],
});
export const initialState = {
  getMarketsLoading: false,
  getMarketsSuccess: false,
  getMarketsError: false,
  markets: [],
  totalValueLocked: '0',
  totalValueBorrowed: '0',
  totalUserSupplied: '0',
  totalUserBorrowed: '0',
  getTopMarketsLoading: false,
  getTopMarketsSuccess: false,
  getTopMarketsError: false,
  topMarkets: [],
  getDailyProtocolDataLoading: false,
  getDailyProtocolDataSuccess: false,
  getDailyProtocolDataError: false,
  dailyProtocolData: {
    date: [],
    totalValueLocked: [],
    totalValueBorrowed: [],
  },
};
const marketsReducer = (state = initialState, action) =>
  produce(state, (/* draft */) => {
    switch (action.type) {
      case globalTypes.GET_MARKETS_LOAD:
        return {
          ...state,
          getMarketsLoading: true,
          getMarketsSuccess: false,
          getMarketsError: false,
          markets: [],
        };
      case globalTypes.GET_MARKETS_SUCCESS:
        return {
          ...state,
          getMarketsLoading: false,
          getMarketsSuccess: true,
          getMarketsError: false,
          markets: action.data,
        };
      case globalTypes.GET_MARKETS_ERROR:
        return {
          ...state,
          getMarketsLoading: false,
          getMarketsSuccess: false,
          getMarketsError: true,
          markets: [],
        };
      case globalTypes.GET_TOP_MARKETS_LOAD:
        return {
          ...state,
          getTopMarketsLoading: true,
          getTopMarketsSuccess: false,
          getTopMarketsError: false,
          topMarkets: [],
        };
      case globalTypes.GET_TOP_MARKETS_SUCCESS:
        return {
          ...state,
          getTopMarketsLoading: false,
          getTopMarketsSuccess: true,
          getTopMarketsError: false,
          topMarkets: action.data,
        };
      case globalTypes.GET_TOP_MARKETS_ERROR:
        return {
          ...state,
          getTopMarketsLoading: false,
          getTopMarketsSuccess: false,
          getTopMarketsError: true,
          topMarkets: [],
        };
      case globalTypes.GET_DAILY_PROTOCOL_DATA_LOAD:
        return {
          ...state,
          getDailyProtocolDataLoading: true,
          getDailyProtocolDataSuccess: false,
          getDailyProtocolDataError: false,
          dailyProtocolData: {
            date: [],
            totalValueLocked: [],
            totalValueBorrowed: [],
          },
        };
      case globalTypes.GET_DAILY_PROTOCOL_DATA_SUCCESS:
        return {
          ...state,
          getDailyProtocolDataLoading: false,
          getDailyProtocolDataSuccess: true,
          getDailyProtocolDataError: false,
          dailyProtocolData: action.data,
        };
      case globalTypes.GET_DAILY_PROTOCOL_DATA_ERROR:
        return {
          ...state,
          getDailyProtocolDataLoading: false,
          getDailyProtocolDataSuccess: false,
          getDailyProtocolDataError: true,
          dailyProtocolData: {
            date: [],
            totalValueLocked: [],
            totalValueBorrowed: [],
          },
        };
      case globalTypes.SET_MARKETS_STATS:
        return {
          ...state,
          totalValueLocked: action.data.totalValueLocked,
          totalValueBorrowed: action.data.totalValueBorrowed,
          totalUserSupplied: action.data.totalUserSupplied,
          totalUserBorrowed: action.data.totalUserBorrowed,
        };
      case globalTypes.UPDATE_MARKET:
        const marketsData = state.markets.map((market) => {
          if (market.id === action.data.id) {
            return action.data.market;
          }
          return market;
        });
        return {
          ...state,
          markets: marketsData,
        };
    }
  });
export default marketsReducer;
