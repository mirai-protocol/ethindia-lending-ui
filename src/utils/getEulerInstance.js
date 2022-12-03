import { ethers } from 'ethers';
import { Euler } from '@eulerxyz/euler-sdk';

export const getMaticReadOnlyEulerInstance = () => {
  const provider = new ethers.providers.JsonRpcProvider(
    'https://polygon-mumbai.g.alchemy.com/v2/pf-Vjo8BFyrKeYQXjGplOPeDyUQ5FVIU'
  );
  return new Euler(provider);
};
const getEulerInstance = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new Euler(signer);
};
export default getEulerInstance;
