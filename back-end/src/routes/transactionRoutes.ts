import express from 'express';
import { TransactionController } from '../controllers/transactionController.js';

const router = express.Router();

/**
 * @swagger
 * /transactions:
 *   post:
 *     tags:
 *       - Transaction
 *     summary: Create a new transaction
 *     description: Creates a new transaction for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       201:
 *         description: Transaction successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *   get:
 *     tags:
 *       - Transaction
 *     summary: Get all transactions
 *     description: Retrieves all transactions for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', TransactionController.createTransaction);
router.get('/', TransactionController.getTransactions);

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     tags:
 *       - Transaction
 *     summary: Delete a transaction
 *     description: Deletes an existing transaction
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     responses:
 *       204:
 *         description: Transaction deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 */
router.delete('/:id', TransactionController.deleteTransaction);

export default router;
