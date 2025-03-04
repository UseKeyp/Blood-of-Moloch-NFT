import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
import { config as dotenvConfig } from "dotenv";
import type { HardhatUserConfig } from "hardhat/config";
import type { NetworkUserConfig } from "hardhat/types";
import { resolve } from "path";

import "./tasks";

const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || "./.env";
dotenvConfig({ path: resolve(__dirname, dotenvConfigPath) });

// Ensure that we have all the environment variables we need.
const mnemonic: string | undefined = process.env.MNEMONIC;
if (!mnemonic) {
  throw new Error("Please set your MNEMONIC in a .env file");
}

const infuraApiKey: string | undefined = process.env.INFURA_API_KEY;

if (!infuraApiKey) {
  throw new Error("Please set your INFURA_API_KEY in a .env file");
}

const chainIds = {
  hardhat: 31337,
  mainnet: 1,
  goerli: 5,
  "polygon-mainnet": 137,
  "polygon-mumbai": 80001,
  "sandbox-mumbai": 80001,
};

const getChainConfig = (chain: keyof typeof chainIds): NetworkUserConfig => {
  const jsonRpcUrl = "https://" + chain + ".infura.io/v3/" + infuraApiKey;

  return {
    accounts: {
      count: 10,
      mnemonic,
      path: "m/44'/60'/0'/0",
    },
    chainId: chainIds[chain],
    url: jsonRpcUrl,
  };
};

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY || "",
      polygon: process.env.POLYGONSCAN_API_KEY || "",
      goerli: process.env.ETHERSCAN_GOERLI_API_KEY || "",
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || "",
    },
  },
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    src: "./contracts",
  },
  networks: {
    hardhat: {},
    mainnet:{
      accounts: {
        mnemonic,
      },
      url: `https://rpc.ankr.com/eth`,
      chainId: chainIds.hardhat,
      allowUnlimitedContractSize: false,
    },
      goerli: {
        accounts: {
          mnemonic,
        },
        url:`https://rpc.ankr.com/eth_goerli`,
        chainId: chainIds.hardhat,
        allowUnlimitedContractSize: false,
      },
    "polygon-mainnet": { ...getChainConfig("polygon-mainnet"), url: "https://rpc.ankr.com/polygon" },
    "polygon-mumbai": { ...getChainConfig("polygon-mumbai"), url: "https://rpc.ankr.com/polygon_mumbai" },
    "sandbox-mumbai": { ...getChainConfig("sandbox-mumbai"), url: "https://rpc.ankr.com/polygon_mumbai" },
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    compilers: [
      {
        version: "0.8.17",
      },
    ],
    settings: {
      metadata: {
        // Not including the metadata hash
        // https://github.com/paulrberg/hardhat-template/issues/31
        bytecodeHash: "none",
      },
      // Disable the optimizer when debugging
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: true,
        runs: 800,
      },
    },
  },
  typechain: {
    outDir: "types",
    target: "ethers-v5",
  },
};

export default config;
