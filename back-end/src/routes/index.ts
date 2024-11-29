import express from 'express';
import profileRoutes from './profileRoutes.js';
import transactionRoutes from './transactionRoutes.js';
import authRoutes from './authRoutes.js';

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/profiles', profileRoutes);
router.use('/transactions', transactionRoutes);

export default router;
