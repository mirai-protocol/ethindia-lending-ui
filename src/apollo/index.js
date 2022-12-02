import { ApolloClient, InMemoryCache } from '@apollo/client';
import merge from 'lodash.merge';
import { useMemo } from 'react';
import { funlink } from './link';

export function createApolloClient() {
  const link = funlink();
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    connectToDevTools: true,
    link,
    cache: new InMemoryCache(),
  });
}

export function getApollo(initialState = null) {
  const _apolloClient = createApolloClient();

  if (initialState) {
    const existingCache = _apolloClient.extract();
    const data = merge(initialState, existingCache);
    _apolloClient.cache.restore(data);
  }

  return _apolloClient;
}

export function useApollo() {
  return useMemo(() => getApollo(), []);
}
