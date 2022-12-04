/* eslint-disable react/prop-types */
import React from 'react';
import { Web3Modal} from '@web3modal/react';
import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
// import { getDefaultProvider } from 'ethers';
// import { Web3ReactProvider, createWeb3ReactRoot } from '@web3-react/core';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from './apollo';

const Providers = ({ children }) => {
  const chains = [chain.goerli, chain.polygonMumbai];
  // const Web3ProviderNetwork = createWeb3ReactRoot('NETWORK');
  // const getLibrary = (provider) => provider;
  const client = useApollo();
  const { provider } = configureChains(chains, [
    walletConnectProvider({ projectId: '2ad969628058e68d8f8883ce26b636a0' }),
  ]);
  const wagmiClient = createClient({
    autoConnect: true,
    connectors: modalConnectors({ appName: 'web3Modal', chains }),
    provider,
  });
  const ethereumClient = new EthereumClient(wagmiClient, chains);
  return (
    // <Web3ReactProvider getLibrary={getLibrary}>
    // <Web3ProviderNetwork getLibrary={getLibrary}>
    <WagmiConfig client={wagmiClient}>
      <ApolloProvider client={client}>
        {/* <Web3Button /> */}
        <Web3Modal projectId="2ad969628058e68d8f8883ce26b636a0" ethereumClient={ethereumClient} />
        {children}
      </ApolloProvider>
    </WagmiConfig>
    // </Web3ProviderNetwork>
    // </Web3ReactProvider>
  );
};
export default Providers;
