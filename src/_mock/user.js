import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const users = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  token: sample([
    {
      name: 'USD Coin',
      symbol: 'USDC',
      imgrc: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389'
    },
    {
      name: 'Wrapped Ether',
      symbol: 'WETH',
      imgrc: 'https://assets.coingecko.com/coins/images/2518/large/weth.png?1628852295'
    },
    {
      name: 'Dai',
      symbol: 'DAI',
      imgrc: 'https://assets.coingecko.com/coins/images/9956/large/4943.png?1636636734'
    },
    {
      name: 'Uniswap',
      symbol: 'UNI',
      imgrc: 'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png?1600306604'
    },
    {
      name: 'FTT',
      symbol: 'FTX',
      imgrc: 'https://assets.coingecko.com/coins/images/9026/large/F.png?1609051564'
    },
    {
      name: 'Tether',
      symbol: 'USDT',
      imgrc: 'https://assets.coingecko.com/coins/images/325/large/tether.png?1667933073'
    },
    {
      name: 'Wrapped Bitcoin',
      symbol: 'WBTC',
      imgrc: 'https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png?1548822744'
    },
    {
      name: 'ChainLink',
      symbol: 'LINK',
      imgrc: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png?1547034700'
    }
  ]),
  type: sample(['Chainlink', 'Uniswap']),
  rating: faker.datatype.number({ min: 1, max: 3 }),
  price: faker.datatype.number({ min: 1, max: 100 }),
  supplyApy: faker.datatype.number({ min: 1, max: 100 }) ,
  borrowApy: faker.datatype.number({ min: 1, max: 100 }),
  totalSupply: faker.datatype.number(),
  totalBorrow: faker.datatype.number(),
  available: faker.datatype.number(),
}));

export default users;
