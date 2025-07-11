/**
 * Smart Contract Configuration
 * Contains contract addresses, ABIs, and network configurations
 */

// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  mainnet: process.env.CREATEX_MAINNET_ADDRESS || '0x0000000000000000000000000000000000000000',
  sepolia: process.env.CREATEX_SEPOLIA_ADDRESS || '0x0000000000000000000000000000000000000000',
  goerli: process.env.CREATEX_GOERLI_ADDRESS || '0x0000000000000000000000000000000000000000',
  polygon: process.env.CREATEX_POLYGON_ADDRESS || '0x0000000000000000000000000000000000000000',
  arbitrum: process.env.CREATEX_ARBITRUM_ADDRESS || '0x0000000000000000000000000000000000000000',
  optimism: process.env.CREATEX_OPTIMISM_ADDRESS || '0x0000000000000000000000000000000000000000',
};

// Network configurations
export const NETWORKS = {
  mainnet: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: process.env.MAINNET_RPC_URL,
    blockExplorer: 'https://etherscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
  },
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: process.env.SEPOLIA_RPC_URL,
    blockExplorer: 'https://sepolia.etherscan.io',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'SEP', decimals: 18 }
  },
  goerli: {
    chainId: 5,
    name: 'Goerli Testnet',
    rpcUrl: process.env.GOERLI_RPC_URL,
    blockExplorer: 'https://goerli.etherscan.io',
    nativeCurrency: { name: 'Goerli Ether', symbol: 'GOR', decimals: 18 }
  },
  polygon: {
    chainId: 137,
    name: 'Polygon Mainnet',
    rpcUrl: process.env.POLYGON_RPC_URL,
    blockExplorer: 'https://polygonscan.com',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }
  },
  arbitrum: {
    chainId: 42161,
    name: 'Arbitrum One',
    rpcUrl: process.env.ARBITRUM_RPC_URL,
    blockExplorer: 'https://arbiscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
  },
  optimism: {
    chainId: 10,
    name: 'Optimism',
    rpcUrl: process.env.OPTIMISM_RPC_URL,
    blockExplorer: 'https://optimistic.etherscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
  }
};

// CreateX Contract ABI (simplified for key functions)
export const ABI = {
  CreateX: [
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "initCode",
          "type": "bytes"
        }
      ],
      "name": "deployCreate",
      "outputs": [
        {
          "internalType": "address",
          "name": "newContract",
          "type": "address"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "salt",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "initCode",
          "type": "bytes"
        }
      ],
      "name": "deployCreate2",
      "outputs": [
        {
          "internalType": "address",
          "name": "newContract",
          "type": "address"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "salt",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "initCode",
          "type": "bytes"
        }
      ],
      "name": "deployCreate3",
      "outputs": [
        {
          "internalType": "address",
          "name": "newContract",
          "type": "address"
        }
      ],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "salt",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "initCodeHash",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "deployer",
          "type": "address"
        }
      ],
      "name": "computeCreate2Address",
      "outputs": [
        {
          "internalType": "address",
          "name": "computedAddress",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "salt",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "deployer",
          "type": "address"
        }
      ],
      "name": "computeCreate3Address",
      "outputs": [
        {
          "internalType": "address",
          "name": "computedAddress",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "salt",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newContract",
          "type": "address"
        }
      ],
      "name": "ContractCreation",
      "type": "event"
    }
  ]
};

// Gas price configurations
export const GAS_CONFIGS = {
  CREATE: {
    gasLimit: 500000,
    maxFeePerGas: '50000000000', // 50 gwei
    maxPriorityFeePerGas: '2000000000' // 2 gwei
  },
  CREATE2: {
    gasLimit: 600000,
    maxFeePerGas: '50000000000',
    maxPriorityFeePerGas: '2000000000'
  },
  CREATE3: {
    gasLimit: 800000,
    maxFeePerGas: '50000000000',
    maxPriorityFeePerGas: '2000000000'
  }
};

// API rate limits
export const RATE_LIMITS = {
  compute: 100, // requests per 15 minutes
  deploy: 20,   // requests per 15 minutes
  query: 500    // requests per 15 minutes
};

export default {
  CONTRACT_ADDRESSES,
  NETWORKS,
  ABI,
  GAS_CONFIGS,
  RATE_LIMITS
};
