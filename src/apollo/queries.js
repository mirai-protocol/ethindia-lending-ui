import { gql } from "@apollo/client";

export const getMarkets = gql`
query markets {
  markets(orderBy: totalDepositBalanceUSD, orderDirection: desc) {
    id
    name
    isActive
    canUseAsCollateral
    canBorrowFrom
    maximumLTV
    liquidationThreshold
    inputToken{
      id
      name
      lastPriceUSD
      symbol
    }
    outputToken {
      id
      name
      lastPriceUSD
      symbol
      decimals
    }
    rates{
      id
      rate
      duration
      maturityBlock
			type
    }
    totalValueLockedUSD
    totalDepositBalanceUSD
    totalBorrowBalanceUSD
    inputTokenBalance
    inputTokenPriceUSD
    outputTokenPriceUSD
    exchangeRate
  }
}
`;
export const getDailyMarketTrends = gql`
  query dailyMarkets{
    financialsDailySnapshots(orderBy: timestamp, orderDirection: desc) {
        dailyDepositUSD
        dailyWithdrawUSD
        totalValueLockedUSD
        totalDepositBalanceUSD
        timestamp
        totalBorrowBalanceUSD
      }
  }
`

export const totalSupplyTopMarkets = gql`
  query dailyMarkets{
    markets(orderBy: totalDepositBalanceUSD, orderDirection: desc, first: 3) {
      inputToken {
        id
        decimals
        name
        symbol
        lastPriceUSD
      }
      totalDepositBalanceUSD
      totalBorrowBalanceUSD
    }
  }
`