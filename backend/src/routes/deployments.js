import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { createLogger } from '../utils/logger.js';

const router = express.Router();
const logger = createLogger();

// In-memory storage for deployments (in production, use a database)
const deployments = new Map();

/**
 * POST /api/deployments
 * Save deployment information
 */
router.post('/', [
  body('network').isString().notEmpty(),
  body('method').isIn(['create', 'create2', 'create3']),
  body('transactionHash').isHexadecimal(),
  body('contractAddress').isEthereumAddress(),
  body('deployer').isEthereumAddress(),
  body('salt').optional().isHexadecimal(),
  body('bytecode').isHexadecimal()
], async (req, res) => {
  try {
    const deployment = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...req.body
    };

    deployments.set(deployment.id, deployment);

    res.status(201).json({
      success: true,
      data: deployment
    });
  } catch (error) {
    logger.error('Error saving deployment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save deployment'
    });
  }
});

/**
 * GET /api/deployments
 * Get deployment history
 */
router.get('/', async (req, res) => {
  try {
    const { network, deployer, limit = 50 } = req.query;
    
    let results = Array.from(deployments.values());
    
    if (network) {
      results = results.filter(d => d.network === network);
    }
    
    if (deployer) {
      results = results.filter(d => d.deployer.toLowerCase() === deployer.toLowerCase());
    }
    
    results = results
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: {
        deployments: results,
        total: results.length
      }
    });
  } catch (error) {
    logger.error('Error getting deployments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get deployments'
    });
  }
});

export default router;
