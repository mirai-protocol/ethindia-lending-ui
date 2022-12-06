import { InjectedConnector } from '@web3-react/injected-connector';
import MetamaskIcon from '../images/metamask.png';

export const setMetamaskGasPrice = {
  maxPriorityFeePerGas: null,
  maxFeePerGas: null,
};
export const SUPPORTED_NETWORK_IDS = [137, 80001, 5, 1];
export const TOKEN_IMAGES = {
  CNT: 'https://cryption-network-local.infura-ipfs.io/ipfs/QmceihNozdFNThRJiP2X93X2LXmSb5XWzsTaNsVBA7GwTZ',
  USDC: 'https://cryption-network-local.infura-ipfs.io/ipfs/QmV17MDKrb3aCQa2a2SzBZaCeAeAFrpFmqCjn351cWApGS',
  USDT: 'https://cryption-network-local.infura-ipfs.io/ipfs/QmTXHnF2hcQyqo7DGGRDHMizUMCNRo1CNBJYwbXUKpQWj2',
  DAI: 'https://cryption-network-local.infura-ipfs.io/ipfs/QmVChZZtAijsiTnMRFb6ziQLnRocXnBU2Lb3F67K2ZPHho',
  MATIC: 'https://cryption-network-local.infura-ipfs.io/ipfs/QmQnnPC9FKVdC2qnvHdDE45cz6q8grpeBLwBWNETVwzi5Q',
  WMATIC: 'https://cryption-network-local.infura-ipfs.io/ipfs/QmQnnPC9FKVdC2qnvHdDE45cz6q8grpeBLwBWNETVwzi5Q',
  BNB: 'https://cryption-network-local.infura-ipfs.io/ipfs/QmRNM1Ty5Gtk7s2UpzKZ8phYJd7TVWE4EFjYgPdRHxiPVn',
  DEV: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6836.png',
  ETH: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
  WETH: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
  WBTC: 'https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png?1548822744',
  UNI: 'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png?1600306604',
  FTX: 'https://assets.coingecko.com/coins/images/9026/large/F.png?1609051564',
  LINK: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png?1547034700',
};
export const injected = new InjectedConnector({
  supportedChainIds: [137, 80001, 5, 1],
});
export const SUPPORTED_WALLETS = {
  METAMASK: {
    connector: injected,
    name: 'METAMASK',
    iconName: MetamaskIcon,
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
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
  'https://unpkg.com/quickswap-default-token-list@latest/build/quickswap-default.tokenlist.json';
export const NETWORKS = {
  137: {
    name: 'Polygon Mainnet',
  },
  80001: {
    name: 'Polygon Testnet',
  },
};
export const SUPPORTED_NETWORKS = [
  // {
  //   title: "Polygon Mainnet",
  //   chainId: "137",
  //   imgSrc: "https://polygonscan.com/images/svg/brands/polygon.svg",
  //   rpcUrl:
  //     "https://young-broken-waterfall.matic.quiknode.pro/947d91789e47ec1531edf15e5fc1b8d7f6de9f2b/",
  // },
  // {
  //   title: "Ethereum Mainnet",
  //   chainId: "1",
  //   imgSrc: "https://etherscan.io/images/brandassets/etherscan-logo-circle.jpg",
  //   rpcUrl: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  // },
  {
    title: 'Mumbai Testnet',
    name: 'moonbase-alphanet',
    chainId: '80001',
    imgSrc: 'https://polygonscan.com/images/svg/brands/polygon.svg',
    rpcUrl: 'https://polygon-mumbai.g.alchemy.com/v2/FTbhFEHlJbgxwf0U0DQtTDqbANNhfuc1',
  },
  {
    title: 'Goerli Test Network',
    chainId: '5',
    imgSrc: 'https://etherscan.io/images/brandassets/etherscan-logo-circle.jpg',
    rpcUrl: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  },
];
export const NATIVE_TOKENS = {
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
  5: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: '18',
  },
};
export const nonMaticTokenAddressMapping = {
  usdc: {
    5: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
    80001: '0x2eddc4d432f0af7c05f9acf95ebe8b12bd9f83b6',
    name: 'Tether Usd',
    symbol: 'USDC',
    decimals: '6'
  },
  weth: {
    5: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
    80001: '0x38f501a3447ad5c009bd94704eaae099300d8b46',
    name: 'Wrapped ETH',
    symbol: 'WETH',
    decimals: '18'
  },
  dai: {
    5: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
    80001: '0xd1efafdfc8d0fb032d0c5f4f0c8c7d2ce5094d54',
    name: 'DAI',
    symbol: 'DAI',
    decimals: '18'
  },
  bat: {
    5: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F', // dai address pasted
    80001: '0xd9b9f2c806ed85cf98560e4be61cf2d2fde58a8c',
    name: 'Basic Attention Token',
    symbol: 'BAT',
    decimals: '18'
  },
  wmatic: {
    5: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
    80001: '0x9c3c9283d3e44854697cd22d3faa240cfb032889',
    name: 'Wrapped Matic',
    symbol: 'WMATIC',
    decimals: '18'
  },
};

export const addressesChainMappings = {
  eToken: {
    80001: '0x28Abb9C008F83b3B29CcA7FF7859293978c847f4',
    5: '0x17D0668dfAD8e419650D1F1B38E1f4B0C2cF6Fe4',
  },
  dToken: {
    80001: '0x7D627B8a5dDf1e5e0b71f6786C470FCCdd6d16Ba',
    5: '0x679b6868FE19AbE1510977d95C7c06ecE94baF7f',
  },
};

export const TARGET_ADDRESS = '0x4836966fa10A5DD930c9a4BcA62873b25757619d';
export const relayFee = 0;
export const destinationDomain = 9991;