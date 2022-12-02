/* eslint-disable react/prop-types */
import React from 'react';
import { Web3ReactProvider, createWeb3ReactRoot } from '@web3-react/core';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from './apollo';

const Providers = ({ children }) => {
  const Web3ProviderNetwork = createWeb3ReactRoot('NETWORK');
  const getLibrary = (provider) => provider;
  const client = useApollo();
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  );
};
export default Providers;