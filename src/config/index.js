import { InjectedConnector } from "@web3-react/injected-connector";
import MetamaskIcon from "../images/metamask.png";

export const setMetamaskGasPrice = {
  maxPriorityFeePerGas: null,
  maxFeePerGas: null,
};
export const SUPPORTED_NETWORK_IDS = [137, 80001];

export const NATIVE_TOKENS = {
  80001: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: "18",
  },
  137: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: "18",
  },
  1: {
    name: "ETH",
    symbol: "ETH",
    decimals: "18",
  },
  1287: {
    name: "Glimmer",
    symbol: "GLMR",
    decimals: "18",
  },
};
export const injected = new InjectedConnector({
  supportedChainIds: [137, 80001],
});
export const SUPPORTED_WALLETS = {
  METAMASK: {
    connector: injected,
    name: 'METAMASK',
    iconName: MetamaskIcon,
    description: "Easy-to-use browser extension.",
    href: null,
    color: "#E8831D",
  },
  // BLOCKWALLET: {
  //   connector: injected,
  //   name: GlobalConst.walletName.BLOCKWALLET,
  //   iconName: BlockWalletIcon,
  //   description: "BlockWallet browser extension.",
  //   href: null,
  //   color: "#1673ff",
  // },
  // BITKEEP: {
  //   connector: injected,
  //   name: GlobalConst.walletName.BITKEEP,
  //   iconName: BitKeepIcon,
  //   description: "BitKeep browser extension.",
  //   href: null,
  //   color: "#E8831D",
  // },
  // INJECTED: {
  //   connector: injected,
  //   name: GlobalConst.walletName.INJECTED,
  //   iconName: "arrow-right.svg",
  //   description: "Injected web3 provider.",
  //   href: null,
  //   color: "#010101",
  //   primary: true,
  // },
  // ARKANE_CONNECT: {
  //   connector: arkaneconnect,
  //   name: GlobalConst.walletName.ARKANE_CONNECT,
  //   iconName: VenlyIcon,
  //   description: "Login using Venly hosted wallet.",
  //   href: null,
  //   color: "#4196FC",
  // },
  // Portis: {
  //   connector: portis,
  //   name: GlobalConst.walletName.Portis,
  //   iconName: PortisIcon,
  //   description: "Login using Portis hosted wallet",
  //   href: null,
  //   color: "#4A6C9B",
  //   mobile: true,
  // },
  // WALLET_LINK: {
  //   connector: walletlink,
  //   name: GlobalConst.walletName.WALLET_LINK,
  //   iconName: CoinbaseWalletIcon,
  //   description: "Use Coinbase Wallet app on mobile device",
  //   href: null,
  //   color: "#315CF5",
  // },
  // WALLET_CONNECT: {
  //   connector: walletconnect,
  //   name: GlobalConst.walletName.WALLET_CONNECT,
  //   iconName: WalletConnectIcon,
  //   description: "Connect to Trust Wallet, Rainbow Wallet and more...",
  //   href: null,
  //   color: "#4196FC",
  //   mobile: true,
  // },
};
export const MIN_REWARDS = 2000;
export const MIN_REWARDS_PER_MONTH = 1000;
export const QUICKSWAP_TOKE_URL =
  "https://unpkg.com/quickswap-default-token-list@latest/build/quickswap-default.tokenlist.json";
export const NETWORKS = {
  137: {
    name: 'Polygon Mainnet'
  },
  80001: {
    name: 'Polygon Testnet'
  }
}