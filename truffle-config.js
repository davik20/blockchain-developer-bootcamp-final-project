require("@babel/register");
require("@babel/polyfill");
require('dotenv').config();
const { projectId, mnemonic } = require('./secrets.json');
const HDWalletProvider = require('@truffle/hdwallet-provider');
// const HDWalletProvider = require('@truffle/hdwallet-provider');
// const mnemonic = process.env.MNEMONIC || ""

module.exports = {

  contracts_directory: './contracts/',
  contracts_build_directory: './src/build/contracts/',

  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
      // Useful for deploying to a public network.
    // NB: It's important to wrap the provider as a function.
    ropsten: {
    provider: () => new HDWalletProvider(mnemonic, `wss://ropsten.infura.io/ws/v3/3ee5b26be9d9451b96c018232c629555`),
      network_id: 3,       // Ropsten's id
      gas: 8000000,        // Ropsten has a lower block limit than mainnet
      gasPrice:  20000000000,
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },
    // rinkby: {
    //   provider: function () {
    // return new HDWalletProvider(mnemonic.split(','), `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`)
    //   },
    //   gasPrice: 20000000000,
    //   network_id: 4
    // }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "^0.8.0",
      settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: false,
          runs: 200
        }
      }
    }
  },

  db: {
    enabled: false
  }
};
