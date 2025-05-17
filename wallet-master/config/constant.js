import dotenv from 'dotenv';
dotenv.config();

export const chainData = {
  1: {
    id: "1",
    rpcUrl: process.env.RPC_URL_ETH_TESTNET,
  },
  56: {
    id: "56",
    rpcUrl: process.env.RPC_URL_BSC,
  },
  137: {
    id: "137",
    rpcUrl: process.env.RPC_URL_POLYGON,
  },
  42161: {
    id: "42161",
    rpcUrl: process.env.RPC_URL_ARBITRUM,
  },
  8453: {
    id: "8453",
    rpcUrl: process.env.RPC_URL_BASE,
  },
  10: {
    id: "10",
    rpcUrl: process.env.RPC_URL_OPTIMISM,
  },
  43114: {
    id: "43114",
    rpcUrl: process.env.RPC_URL_AVALANCHE,
  },
  1111: {
    id: "solana",
    rpcUrl: process.env.RPC_URL_SOLANA,
  },
  110: {
    id: "segwit",
    rpcUrl: process.env.RPC_URL_BITCOIN,
  },
  111: {
    id: "legacy",
    rpcUrl: process.env.RPC_URL_BITCOIN,
  },
};
