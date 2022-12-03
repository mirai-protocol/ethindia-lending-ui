import BigNumber from 'bignumber.js';
import { getApollo } from '../apollo/index';
import { getMarkets } from '../apollo/queries';
import { TARGET_ADDRESS, TOKEN_IMAGES, nonMaticTokenAddressMapping, addressesChainMappings } from '../config';
import targetAbi from '../config/abis/target.json';
// import eSourceAbi from '../config/abis/eSource.json';
import erc2oAbi from '../config/abis/erc20.json';
import getEulerInstance, { getMaticReadOnlyEulerInstance } from './getEulerInstance';

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

export const getUserstats = async (market) => {
  let liabilityValue = new BigNumber('0');
  let collateralValue = new BigNumber('0');
  let tokenBal = new BigNumber('0');
  let eulerAllowance = new BigNumber('0');
  let eTokenBalanceUnderlying = new BigNumber('0');
  let dTokenBalance = new BigNumber('0');
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
    .dividedBy(10 ** 18);
  collateralValue = collateralValue
    .plus(market.liquidityStatus.collateralValue.toString())
    .dividedBy(10 ** 18);
  return {
    dTokenBalance,
    eTokenBalanceUnderlying,
    eulerAllowance,
    tokenBal,
    liabilityValue,
    collateralValue,
  }
}
export const getMarketsData = async (account, chainId) => {
  const client = getApollo();
  const { data, error } = await client.query({
    query: getMarkets,
    context: {
      clientName: 'mirai',
    },
  });
  if (data && data.markets) {
    const euler = getMaticReadOnlyEulerInstance();
    const eularGoerliInstance = getEulerInstance(chainId);
    let marketsUserData = null;
    let mappedUserData = null;
    let mappedAccountAddress = null;
    const eulerMaticInstance = getMaticReadOnlyEulerInstance();
    await eulerMaticInstance.addContract('targetContract', targetAbi, TARGET_ADDRESS);
    mappedAccountAddress = await eulerMaticInstance.contracts.targetContract.scw(account);
    if (account) {
      const query = {
        eulerContract: getMaticReadOnlyEulerInstance().addresses.euler,
        account,
        markets: [],
      };
      marketsUserData = await euler.contracts.eulerGeneralView.doQuery(query);
    }
    if (mappedAccountAddress) {
      const query = {
        eulerContract: getMaticReadOnlyEulerInstance().addresses.euler,
        account: mappedAccountAddress,
        markets: [],
      };
      mappedUserData = await euler.contracts.eulerGeneralView.doQuery(query);
    }
    let repayAllowence = new BigNumber('0');
    let totalSupply = new BigNumber('0');
    let totalBorrowed = new BigNumber('0');
    let totalUserSupplied = new BigNumber('0');
    let totalUserBorrowed = new BigNumber('0');
    let totalUserLiadbility = new BigNumber('0');
    let totalUserCollateral = new BigNumber('0');
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
            await Promise.all(marketsUserData.markets.map(async (market) => {
              if (market[0] === isEntered) {
                const mappedMarkert = mappedUserData.markets.find(mappedmarket => mappedmarket[0] === market[0])
                const mappedData = await getUserstats(market)
                liabilityValue = liabilityValue.plus(mappedData.liabilityValue)
                collateralValue = collateralValue.plus(mappedData.collateralValue)
                tokenBal = tokenBal.plus(mappedData.tokenBal)
                eulerAllowance = eulerAllowance.plus(mappedData.eulerAllowance)
                eTokenBalanceUnderlying = eTokenBalanceUnderlying.plus(mappedData.eTokenBalanceUnderlying)
                dTokenBalance = dTokenBalance.plus(mappedData.dTokenBalance)
                if (mappedMarkert) {
                  const mappedmarketData = await getUserstats(mappedMarkert)
                  liabilityValue = liabilityValue.plus(mappedmarketData.liabilityValue)
                  collateralValue = collateralValue.plus(mappedmarketData.collateralValue)
                  eTokenBalanceUnderlying = eTokenBalanceUnderlying.plus(mappedmarketData.eTokenBalanceUnderlying)
                  dTokenBalance = dTokenBalance.plus(mappedmarketData.dTokenBalance)
                }
              }
            }));
            if (chainId === 5) {
              const tokenAddress = nonMaticTokenAddressMapping[eachMarket.inputToken.symbol.toLowerCase()][chainId]
              if (tokenAddress) {
                await eularGoerliInstance.addContract(`g${eachMarket.inputToken.symbol.toLowerCase()}`, erc2oAbi, tokenAddress)
                const allowence = await eularGoerliInstance.contracts[`g${eachMarket.inputToken.symbol.toLowerCase()}`].allowance(
                  account,
                  addressesChainMappings.eToken[chainId]
                );
                eulerAllowance = allowence.toString()
                const allowenceForRepay = await eularGoerliInstance.contracts[`g${eachMarket.inputToken.symbol.toLowerCase()}`].allowance(
                  account,
                  addressesChainMappings.dToken[chainId]
                );
                repayAllowence = allowenceForRepay.toString();
                const tokenBalGoeri = await eularGoerliInstance.contracts[`g${eachMarket.inputToken.symbol.toLowerCase()}`].balanceOf(account);
                tokenBal = new BigNumber(tokenBalGoeri.toString()).dividedBy(10 ** parseFloat(eachMarket.inputToken.decimals))
              }
            }
            totalUserSupplied = totalUserSupplied
              .plus(eTokenBalanceUnderlying)
              .multipliedBy(eachMarket.inputTokenPriceUSD);
            totalUserBorrowed = totalUserBorrowed.plus(dTokenBalance).multipliedBy(eachMarket.inputTokenPriceUSD);
            totalUserLiadbility = totalUserLiadbility.plus(liabilityValue);
            totalUserCollateral = totalUserCollateral.plus(collateralValue);
            userData = {
              ...userData,
              isEntered: true,
              dTokenBalance: dTokenBalance.toString(),
              repayAllowence: repayAllowence.toString(),
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
          totalUserLiadbility,
          totalUserCollateral,
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
        totalUserLiadbility,
        totalUserCollateral,
      },
    };
  }
  return {
    success: false,
    data,
    error,
  };
};
