// Set of helper functions to facilitate wallet setup
// @ts-nocheck

import { nodes } from './getRpcUrl';

/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
const NATIVE_TOKENS = {
  80001: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: '18',
  },
  137: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: '18',
  },
  1: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: '18',
  },
  1287: {
    name: 'Glimmer',
    symbol: 'GLMR',
    decimals: '18',
  },
};
export const setupNetwork = async (chainId) => {
  const provider = window.ethereum;
  if (provider) {
    // @ts-ignore
    let chainIdFallback = parseInt(chainId, 10);
    if (chainIdFallback === null || chainIdFallback === undefined) {
      // @ts-ignore
      chainIdFallback = parseInt(process.env.REACT_APP_CHAIN_ID, 10);
    }
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainIdFallback.toString(16)}` }],
      });
      return true;
    } catch (error) {
      if (error.code === 4902) {
        // @ts-ignore
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${chainIdFallback.toString(16)}`,
              chainName: 'Matic',
              nativeCurrency: {
                name: NATIVE_TOKENS[chainIdFallback].name,
                symbol: NATIVE_TOKENS[chainIdFallback].symbol,
                decimals: NATIVE_TOKENS[chainIdFallback].decimals,
              },
              // @ts-ignore
              rpcUrls: nodes[chainIdFallback],
              blockExplorerUrls: ['https://polygonscan.com/'],
            },
          ],
        });
        return true;
      }
      console.error(error);
      return false;
    }
  } else {
    console.error("Can't setup the BSC network on metamask because window.ethereum is undefined");
    return false;
  }
};

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @param tokenImage
 * @returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async (tokenAddress, tokenSymbol, tokenDecimals, tokenImage) => {
  // @ts-ignore
  const tokenAdded = await window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        image: tokenImage,
      },
    },
  });

  return tokenAdded;
};
