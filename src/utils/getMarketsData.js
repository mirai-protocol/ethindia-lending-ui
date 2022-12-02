import BigNumber from 'bignumber.js';
import { getApollo } from '../apollo/index';
import { getMarkets } from '../apollo/queries';
import { TOKEN_IMAGES } from '../config';
import eularTestnetConfig from '../config/addresses-polygontestnet.json';
import getEularInstance from './getEularInstance';

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});
export const getMarketsData = async (account) => {
  const client = getApollo();
  const { data, error } = await client.query({
    query: getMarkets,
    context: {
      clientName: 'mirai',
    },
  });
  if (data && data.markets) {
    const eular = getEularInstance();
    let marketsUserData = null;
    if (account) {
      const query = {
        eulerContract: eularTestnetConfig.euler,
        account,
        markets: [],
      };
      marketsUserData = await eular.contracts.eulerGeneralView.doQuery(query);
    }

    let totalSupply = new BigNumber('0');
    let totalBorrowed = new BigNumber('0');
    let totalUserSupplied = new BigNumber('0');
    let totalUserBorrowed = new BigNumber('0');
    const marketsData = await Promise.all(
      data.markets.map(async (eachMarket) => {
        let borrowerApy = '0';
        let supplierApy = '0';
        let userData = {
          isEntered: false,
          totalCollatral: '0',
          totalLiability: '0',
          tokenBal: '0',
          eulerAllowance: '0',
        };
        if (account && marketsUserData) {
          const isEntered = marketsUserData.enteredMarkets.find(
            (market) => market.toLowerCase() === eachMarket.inputToken.id.toLowerCase()
          );
          if (isEntered) {
            let liabilityValue = new BigNumber('0');
            let collateralValue = new BigNumber('0');
            let tokenBal = new BigNumber('0');
            let eulerAllowance = new BigNumber('0');
            let eTokenBalanceUnderlying = new BigNumber('0');
            let dTokenBalance = new BigNumber('0');
            marketsUserData.markets.forEach((market) => {
              if (market[0] === isEntered) {
                dTokenBalance = new BigNumber(market.dTokenBalance.toString()).dividedBy(
                  10 ** parseFloat(market.decimals)
                );
                eTokenBalanceUnderlying = new BigNumber(market.eTokenBalanceUnderlying.toString()).dividedBy(
                  10 ** parseFloat(market.decimals)
                );
                eulerAllowance = new BigNumber(market.eulerAllowance.toString()).dividedBy(
                  10 ** parseFloat(market.decimals)
                );
                tokenBal = new BigNumber(market.underlyingBalance.toString()).dividedBy(
                  10 ** parseFloat(market.decimals)
                );
                liabilityValue = liabilityValue
                  .plus(market.liquidityStatus.liabilityValue.toString())
                  .dividedBy(10 ** parseFloat(market.decimals));
                collateralValue = collateralValue
                  .plus(market.liquidityStatus.collateralValue.toString())
                  .dividedBy(10 ** parseFloat(market.decimals));
              }
            });
            totalUserSupplied = totalUserSupplied
              .plus(eTokenBalanceUnderlying)
              .multipliedBy(eachMarket.inputTokenPriceUSD);
            totalUserBorrowed = totalUserBorrowed.plus(dTokenBalance).multipliedBy(eachMarket.inputTokenPriceUSD);
            userData = {
              ...userData,
              isEntered: true,
              dTokenBalance: dTokenBalance.toString(),
              eTokenBalanceUnderlying: eTokenBalanceUnderlying.toString(),
              eulerAllowance: eulerAllowance.toString(),
              tokenBal: tokenBal.toString(),
              totalCollatral: collateralValue.toString(),
              totalLiability: liabilityValue.toString(),
            };
          }
        }
        totalSupply = totalSupply.plus(eachMarket.totalValueLockedUSD);
        totalBorrowed = totalBorrowed.plus(eachMarket.totalBorrowBalanceUSD);
        if (eachMarket && eachMarket.rates.length > 0) {
          const borrower = eachMarket.rates.find((rate) => rate.id === `BORROWER-VARIABLE-${eachMarket.id}`);
          const supplier = eachMarket.rates.find((rate) => rate.id === `LENDER-VARIABLE-${eachMarket.id}`);
          if (borrower) {
            borrowerApy = borrower.rate;
          }
          if (supplier) {
            supplierApy = supplier.rate;
          }
        }
        eachMarket = {
          ...eachMarket,
          available: parseFloat(eachMarket.totalDepositBalanceUSD) - parseFloat(eachMarket.totalBorrowBalanceUSD),
          inputToken: {
            ...eachMarket.inputToken,
            logoImg: TOKEN_IMAGES[eachMarket.inputToken.symbol.toUpperCase()]
              ? TOKEN_IMAGES[eachMarket.inputToken.symbol.toUpperCase()]
              : null,
          },
          borrowerApy,
          supplierApy,
          userData,
        };
        return eachMarket;
      })
    );
    if (marketsData) {
      return {
        success: true,
        data: {
          markets: marketsData,
          totalSupply,
          totalBorrowed,
          totalUserSupplied,
          totalUserBorrowed,
        },
      };
    }
    return {
      success: false,
      data: {
        markets: marketsData,
        totalSupply,
        totalBorrowed,
        totalUserSupplied,
        totalUserBorrowed,
      },
    };
  }
  return {
    success: false,
    data,
    error,
  };
};
