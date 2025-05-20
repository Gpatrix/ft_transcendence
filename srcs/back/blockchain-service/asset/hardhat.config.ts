import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const FORK_FUJI = false;
let forkingData = undefined;

if (FORK_FUJI) {
  forkingData = {
    url: process.env.FUJI_URL || "https://api.avax-test.network/ext/bc/C/rpc",
  };
}

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  paths: {
    sources: "./srcs/contracts",
    tests: "./srcs/test",
    cache: "./cache",
    artifacts: "./srcs/artifacts"
  },
  networks: {
    hardhat: {
      gasPrice: 225000000000,
      chainId: !forkingData ? 43112 : undefined,
      forking: forkingData
    },
    fuji: {
      url: process.env.FUJI_URL || "https://api.avax-test.network/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: process.env.FUJI_CHAIN_ID || 43113,
      accounts: [process.env.FUJI_PRIVATE_KEY || ""]
    }
  }
};

export default config;