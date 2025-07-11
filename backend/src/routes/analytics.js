import express from 'express';

const router = express.Router();

/**
 * GET /api/analytics/stats
 * Get deployment statistics
 */
router.get('/stats', async (req, res) => {
  try {
    // Mock analytics data (replace with real data in production)
    const stats = {
      totalDeployments: 1250,
      deploymentsToday: 15,
      deploymentsThisWeek: 89,
      deploymentsThisMonth: 324,
      methodDistribution: {
        create: 450,
        create2: 650,
        create3: 150
      },
      networkDistribution: {
        mainnet: 800,
        sepolia: 200,
        goerli: 150,
        polygon: 100
      },
      averageGasUsed: {
        create: '250000',
        create2: '320000',
        create3: '450000'
      }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get analytics'
    });
  }
});

export default router;
