import { ethers } from 'ethers';
import { Euler } from "@eulerxyz/euler-sdk"
import eularTestnetConfig from '../config/addresses-polygontestnet.json';

const getEularInstance = () => {
  // const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const eularConfig = {
    addresses: {
      euler: eularTestnetConfig.euler,
      exec: eularTestnetConfig.exec,
      liquidation: eularTestnetConfig.liquidation,
      markets: eularTestnetConfig.markets,
      swap: eularTestnetConfig.swap,
      swapHub: eularTestnetConfig.swapHub,
      eulStakes: eularTestnetConfig.eulStakes,
      eulDistributor: eularTestnetConfig.eulDistributor,
      eulerGeneralView: eularTestnetConfig.eulerGeneralView,
      eul: eularTestnetConfig.eul.address,
      eToken: eularTestnetConfig.eToken,
      dToken: eularTestnetConfig.dToken,
      pToken: eularTestnetConfig.pToken,
    },
    eul: eularTestnetConfig.eul,
    referenceAsset: "0x38f501A3447aD5c009Bd94704eaAe099300d8B46"
  }
  const eular = new Euler(signer, 80001, eularConfig);
  return eular
}
export default getEularInstance;