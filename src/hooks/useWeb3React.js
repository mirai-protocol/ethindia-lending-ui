import { useNetwork, useAccount } from 'wagmi'

const useWeb3React = () => {
  const { address, isConnecting } = useAccount()
  const { chain } = useNetwork()
  return {
    account: address,
    isConnecting,
    chainId: chain ? chain.id : undefined
  }
}
export default useWeb3React;