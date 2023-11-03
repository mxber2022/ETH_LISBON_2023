require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });
/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.20",

  networks: {
    'gnosis-testnet': {
      url: 'https://rpc.chiadochain.net',
      accounts: [process.env.PRIVATE_KEY],
    },
    
    'core-testnet': {
      url: 'https://rpc.test.btcs.network/',
      accounts: [process.env.PRIVATE_KEY],
    },

    'neonevm-testnet': {
      url: 'https://devnet.neonevm.org',
      accounts: [process.env.PRIVATE_KEY],
    },  
  },

  etherscan: {
    apiKey: {
      "gnosis-testnet": "abc",
      "core-testnet": "abc",
      "neonevm-testnet": "test"
    },

    customChains: [
      {
        network: "gnosis-testnet",
        chainId: 10200,
        urls: {
          apiURL: "https://gnosis-chiado.blockscout.com/api",
          browserURL: '',
        },
      },

      {
        network: "core-testnet",
        chainId: 1115,
        urls: {
          apiURL: "https://api.test.btcs.network/api",
          browserURL: 'https://scan.test.btcs.network/',
        },
      },

      {
        network: "neonevm-testnet",
        chainId: 245022926,
        urls: {
          apiURL: "https://neon-devnet.blockscout.com/api",
          browserURL: '',
        },
      },

    ],

  },
}