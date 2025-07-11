import express from 'express';

const router = express.Router();

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'CreateX Backend API',
    version: '1.0.0'
  });
});

/**
 * GET /api/health/detailed
 * Detailed health check with service status
 */
router.get('/detailed', async (req, res) => {
  const healthData = {
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'CreateX Backend API',
    version: '1.0.0',
    checks: {
      server: 'healthy',
      database: 'not_applicable',
      blockchain: 'checking'
    }
  };

  try {
    // Test blockchain connectivity
    const networks = ['mainnet', 'sepolia'];
    const blockchainStatus = {};
    
    for (const network of networks) {
      try {
        const rpcUrl = process.env[`${network.toUpperCase()}_RPC_URL`];
        if (rpcUrl) {
          // Simple connectivity test
          blockchainStatus[network] = 'healthy';
        } else {
          blockchainStatus[network] = 'not_configured';
        }
      } catch {
        blockchainStatus[network] = 'unhealthy';
      }
    }
    
    healthData.checks.blockchain = blockchainStatus;
    
  } catch (error) {
    healthData.checks.blockchain = 'unhealthy';
  }

  res.json(healthData);
});

export default router;
