import express from 'express';
const router = express.Router();

// Mock payment until Stripe integration
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, address } = req.body;

    if (!address || !address.lat || !address.lng) {
      return res.status(400).json({ error: 'Valid delivery address required' });
    }

    // Mock successful payment intent
    res.json({
      clientSecret: 'mock_secret_' + Date.now(),
      paymentIntentId: 'mock_pi_' + Date.now(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;