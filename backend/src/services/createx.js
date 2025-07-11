import { ethers } from 'ethers';
import { createPublicClient, createWalletClient, http } from 'viem';
import { mainnet, sepolia, goerli } from 'viem/chains';
import { createLogger } from '../utils/logger.js';
import { CONTRACT_ADDRESSES, ABI } from '../config/contracts.js';

const logger = createLogger();

/**
 * CreateX Smart Contract Service
 * Handles interactions with the CreateX factory contract
 */
export class CreateXService {
  constructor() {
    this.providers = this.initializeProviders();
    this.contracts = this.initializeContracts();
  }

  /**
   * Initialize blockchain providers for different networks
   */
  initializeProviders() {
    const providers = {};
    
    // Ethereum Mainnet
    if (process.env.MAINNET_RPC_URL) {
      providers.mainnet = new ethers.JsonRpcProvider(process.env.MAINNET_RPC_URL);
    }
    
    // Sepolia Testnet
    if (process.env.SEPOLIA_RPC_URL) {
      providers.sepolia = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    }
    
    // Goerli Testnet
    if (process.env.GOERLI_RPC_URL) {
      providers.goerli = new ethers.JsonRpcProvider(process.env.GOERLI_RPC_URL);
    }
    
    logger.info(`Initialized providers for ${Object.keys(providers).length} networks`);
    return providers;
  }

  /**
   * Initialize contract instances
   */
  initializeContracts() {
    const contracts = {};
    
    Object.entries(this.providers).forEach(([network, provider]) => {
      const contractAddress = CONTRACT_ADDRESSES[network];
      if (contractAddress) {
        contracts[network] = new ethers.Contract(contractAddress, ABI.CreateX, provider);
      }
    });
    
    return contracts;
  }

  /**
   * Get contract instance for a specific network
   */
  getContract(network = 'mainnet') {
    const contract = this.contracts[network];
    if (!contract) {
      throw new Error(`Contract not available for network: ${network}`);
    }
    return contract;
  }

  /**
   * Compute CREATE2 address
   */
  async computeCreate2Address(network, salt, bytecodeHash, deployer = null) {
    try {
      const contract = this.getContract(network);
      const computedAddress = await contract.computeCreate2Address(
        salt,
        bytecodeHash,
        deployer || contract.target
      );
      
      logger.info(`Computed CREATE2 address: ${computedAddress}`);
      return computedAddress;
    } catch (error) {
      logger.error('Error computing CREATE2 address:', error);
      throw error;
    }
  }

  /**
   * Compute CREATE3 address
   */
  async computeCreate3Address(network, salt, deployer = null) {
    try {
      const contract = this.getContract(network);
      const computedAddress = await contract.computeCreate3Address(
        salt,
        deployer || contract.target
      );
      
      logger.info(`Computed CREATE3 address: ${computedAddress}`);
      return computedAddress;
    } catch (error) {
      logger.error('Error computing CREATE3 address:', error);
      throw error;
    }
  }

  /**
   * Get deployment transaction data
   */
  async getDeploymentData(network, method, salt, bytecode, constructorArgs = []) {
    try {
      const contract = this.getContract(network);
      let txData;

      switch (method) {
        case 'create':
          txData = await contract.deployCreate.populateTransaction(bytecode);
          break;
        case 'create2':
          txData = await contract.deployCreate2.populateTransaction(salt, bytecode);
          break;
        case 'create3':
          txData = await contract.deployCreate3.populateTransaction(salt, bytecode);
          break;
        default:
          throw new Error(`Unsupported deployment method: ${method}`);
      }

      return {
        to: contract.target,
        data: txData.data,
        value: txData.value || '0'
      };
    } catch (error) {
      logger.error('Error getting deployment data:', error);
      throw error;
    }
  }

  /**
   * Estimate gas for deployment
   */
  async estimateGas(network, method, salt, bytecode, from) {
    try {
      const contract = this.getContract(network);
      let gasEstimate;

      switch (method) {
        case 'create':
          gasEstimate = await contract.deployCreate.estimateGas(bytecode, { from });
          break;
        case 'create2':
          gasEstimate = await contract.deployCreate2.estimateGas(salt, bytecode, { from });
          break;
        case 'create3':
          gasEstimate = await contract.deployCreate3.estimateGas(salt, bytecode, { from });
          break;
        default:
          throw new Error(`Unsupported deployment method: ${method}`);
      }

      logger.info(`Gas estimate for ${method}: ${gasEstimate.toString()}`);
      return gasEstimate.toString();
    } catch (error) {
      logger.error('Error estimating gas:', error);
      throw error;
    }
  }

  /**
   * Get transaction receipt and events
   */
  async getTransactionDetails(network, txHash) {
    try {
      const provider = this.providers[network];
      const receipt = await provider.getTransactionReceipt(txHash);
      
      if (!receipt) {
        return null;
      }

      const contract = this.getContract(network);
      const events = receipt.logs
        .map(log => {
          try {
            return contract.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      return {
        ...receipt,
        events,
        status: receipt.status === 1 ? 'success' : 'failed'
      };
    } catch (error) {
      logger.error('Error getting transaction details:', error);
      throw error;
    }
  }

  /**
   * Get contract creation events
   */
  async getCreationEvents(network, fromBlock = 'earliest', toBlock = 'latest') {
    try {
      const contract = this.getContract(network);
      const filter = contract.filters.ContractCreation();
      const events = await contract.queryFilter(filter, fromBlock, toBlock);
      
      return events.map(event => ({
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        salt: event.args.salt,
        newContract: event.args.newContract,
        deployer: event.args.deployer || null
      }));
    } catch (error) {
      logger.error('Error getting creation events:', error);
      throw error;
    }
  }

  /**
   * Validate bytecode
   */
  validateBytecode(bytecode) {
    if (!bytecode || typeof bytecode !== 'string') {
      throw new Error('Invalid bytecode: must be a non-empty string');
    }
    
    if (!bytecode.startsWith('0x')) {
      throw new Error('Invalid bytecode: must start with 0x');
    }
    
    if (bytecode.length % 2 !== 0) {
      throw new Error('Invalid bytecode: must be even length');
    }
    
    return true;
  }

  /**
   * Validate salt
   */
  validateSalt(salt) {
    if (!salt || typeof salt !== 'string') {
      throw new Error('Invalid salt: must be a non-empty string');
    }
    
    if (!ethers.isHexString(salt, 32)) {
      throw new Error('Invalid salt: must be a 32-byte hex string');
    }
    
    return true;
  }
}

export default new CreateXService();
