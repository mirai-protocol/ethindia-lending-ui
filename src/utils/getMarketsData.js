import BigNumber from 'bignumber.js';
import { getApollo } from '../apollo/index';
import { getMarkets } from '../apollo/queries'
import { TOKEN_IMAGES } from '../config'

export const getMarketsData = async () => {
  const client = getApollo();
  const { data, error } = await client.query({
    query: getMarkets,
    context: {
      clientName: "mirai",
    },
  });
  if (data && data.markets) {
    let totalSupply = new BigNumber('0')
    let totalBorrowed = new BigNumber('0')
    const marketsData = data.markets.map(eachMarket => {
      let borrowerApy = '0';
      let supplierApy = '0';
      totalSupply = totalSupply.plus(eachMarket.totalValueLockedUSD)
      totalBorrowed = totalBorrowed.plus(eachMarket.totalBorrowBalanceUSD)
      if (eachMarket && eachMarket.rates.length > 0) {
        const borrower = eachMarket.rates.find(rate => rate.id === `BORROWER-VARIABLE-${eachMarket.id}`)
        const supplier = eachMarket.rates.find(rate => rate.id === `LENDER-VARIABLE-${eachMarket.id}`)
        if (borrower) {
          borrowerApy = borrower.rate
        }
        if (supplier) {
          supplierApy = borrower.rate
        }
      }
      eachMarket = {
        ...eachMarket,
        available: parseFloat(eachMarket.totalDepositBalanceUSD) - parseFloat(eachMarket.totalBorrowBalanceUSD),
        inputToken: {
          ...eachMarket.inputToken,
          logoImg: TOKEN_IMAGES[eachMarket.inputToken.symbol.toUpperCase()] ? TOKEN_IMAGES[eachMarket.inputToken.symbol.toUpperCase()] : null
        },
        borrowerApy,
        supplierApy,
      }
      return eachMarket;
    })
    if (marketsData) {
      return {
        success: true,
        data: {
          markets: marketsData,
          totalSupply,
          totalBorrowed
        }
      }
    }
    return {
      success: false,
      data: {
        markets: marketsData,
        totalSupply,
        totalBorrowed
      }
    }

  }
  return {
    success: false,
    data,
    error
  }
}