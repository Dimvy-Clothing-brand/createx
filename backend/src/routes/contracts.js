import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import createXService from '../services/createx.js';
import { createLogger } from '../utils/logger.js';

const router = express.Router();
const logger = createLogger();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

/**
 * GET /api/contracts/info
 * Get contract information for all networks
 */
router.get('/info', async (req, res) => {
  try {
    const info = {
      networks: Object.keys(createXService.contracts),
      addresses: Object.fromEntries(
        Object.entries(createXService.contracts).map(([network, contract]) => [
          network,
          contract.target
        ])
      ),
      supportedMethods: ['create', 'create2', 'create3']
    };

    res.json({
      success: true,
      data: info
    });
  } catch (error) {
    logger.error('Error getting contract info:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get contract information'
    });
  }
});

/**
 * POST /api/contracts/compute-address
 * Compute contract address for CREATE2/CREATE3
 */
router.post('/compute-address', [
  body('method').isIn(['create2', 'create3']).withMessage('Method must be create2 or create3'),
  body('network').isString().notEmpty().withMessage('Network is required'),
  body('salt').isHexadecimal().isLength({ min: 64, max: 66 }).withMessage('Salt must be a valid 32-byte hex string'),
  body('bytecodeHash').optional().isHexadecimal().isLength({ min: 64, max: 66 }).withMessage('Bytecode hash must be a valid 32-byte hex string'),
  body('deployer').optional().isEthereumAddress().withMessage('Deployer must be a valid Ethereum address')
], handleValidationErrors, async (req, res) => {
  try {
    const { method, network, salt, bytecodeHash, deployer } = req.body;

    let computedAddress;
    if (method === 'create2') {
      if (!bytecodeHash) {
        return res.status(400).json({
          success: false,
          error: 'Bytecode hash is required for CREATE2'
        });
      }
      computedAddress = await createXService.computeCreate2Address(
        network,
        salt,
        bytecodeHash,
        deployer
      );
    } else if (method === 'create3') {
      computedAddress = await createXService.computeCreate3Address(
        network,
        salt,
        deployer
      );
    }

    res.json({
      success: true,
      data: {
        method,
        network,
        salt,
        computedAddress,
        deployer: deployer || 'CreateX contract'
      }
    });
  } catch (error) {
    logger.error('Error computing address:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to compute address'
    });
  }
});

/**
 * POST /api/contracts/deployment-data
 * Get transaction data for contract deployment
 */
router.post('/deployment-data', [
  body('method').isIn(['create', 'create2', 'create3']).withMessage('Invalid deployment method'),
  body('network').isString().notEmpty().withMessage('Network is required'),
  body('bytecode').isHexadecimal().withMessage('Bytecode must be valid hex'),
  body('salt').optional().isHexadecimal().isLength({ min: 64, max: 66 }).withMessage('Salt must be a valid 32-byte hex string'),
  body('constructorArgs').optional().isArray().withMessage('Constructor args must be an array')
], handleValidationErrors, async (req, res) => {
  try {
    const { method, network, bytecode, salt, constructorArgs } = req.body;

    // Validate bytecode
    createXService.validateBytecode(bytecode);

    // Validate salt for CREATE2/CREATE3
    if ((method === 'create2' || method === 'create3') && salt) {
      createXService.validateSalt(salt);
    }

    const deploymentData = await createXService.getDeploymentData(
      network,
      method,
      salt,
      bytecode,
      constructorArgs
    );

    res.json({
      success: true,
      data: {
        method,
        network,
        ...deploymentData
      }
    });
  } catch (error) {
    logger.error('Error getting deployment data:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get deployment data'
    });
  }
});

/**
 * POST /api/contracts/estimate-gas
 * Estimate gas for contract deployment
 */
router.post('/estimate-gas', [
  body('method').isIn(['create', 'create2', 'create3']).withMessage('Invalid deployment method'),
  body('network').isString().notEmpty().withMessage('Network is required'),
  body('bytecode').isHexadecimal().withMessage('Bytecode must be valid hex'),
  body('from').isEthereumAddress().withMessage('From address must be valid'),
  body('salt').optional().isHexadecimal().isLength({ min: 64, max: 66 }).withMessage('Salt must be a valid 32-byte hex string')
], handleValidationErrors, async (req, res) => {
  try {
    const { method, network, bytecode, salt, from } = req.body;

    // Validate inputs
    createXService.validateBytecode(bytecode);
    if ((method === 'create2' || method === 'create3') && salt) {
      createXService.validateSalt(salt);
    }

    const gasEstimate = await createXService.estimateGas(
      network,
      method,
      salt,
      bytecode,
      from
    );

    res.json({
      success: true,
      data: {
        method,
        network,
        gasEstimate,
        estimatedCostWei: gasEstimate,
        from
      }
    });
  } catch (error) {
    logger.error('Error estimating gas:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to estimate gas'
    });
  }
});

/**
 * GET /api/contracts/:network/events
 * Get contract creation events
 */
router.get('/:network/events', [
  param('network').isString().notEmpty().withMessage('Network is required'),
  query('fromBlock').optional().isNumeric().withMessage('From block must be numeric'),
  query('toBlock').optional().isNumeric().withMessage('To block must be numeric'),
  query('limit').optional().isInt({ min: 1, max: 1000 }).withMessage('Limit must be between 1 and 1000')
], handleValidationErrors, async (req, res) => {
  try {
    const { network } = req.params;
    const { fromBlock = 'earliest', toBlock = 'latest', limit = 100 } = req.query;

    const events = await createXService.getCreationEvents(
      network,
      fromBlock,
      toBlock
    );

    // Apply limit
    const limitedEvents = events.slice(0, parseInt(limit));

    res.json({
      success: true,
      data: {
        network,
        events: limitedEvents,
        total: events.length,
        fromBlock,
        toBlock
      }
    });
  } catch (error) {
    logger.error('Error getting creation events:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get creation events'
    });
  }
});

/**
 * GET /api/contracts/:network/transaction/:hash
 * Get transaction details and events
 */
router.get('/:network/transaction/:hash', [
  param('network').isString().notEmpty().withMessage('Network is required'),
  param('hash').isHexadecimal().isLength({ min: 64, max: 66 }).withMessage('Transaction hash must be valid')
], handleValidationErrors, async (req, res) => {
  try {
    const { network, hash } = req.params;

    const transactionDetails = await createXService.getTransactionDetails(network, hash);

    if (!transactionDetails) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: {
        network,
        transactionHash: hash,
        ...transactionDetails
      }
    });
  } catch (error) {
    logger.error('Error getting transaction details:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get transaction details'
    });
  }
});

export default router;
