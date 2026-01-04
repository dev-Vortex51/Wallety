import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validator';
import { DepositSchema, transferSchema } from './wallet.schema';
import {
  depositHandler,
  getHistoryHandler,
  transferHandler,
} from './wallet.controller';

const router = Router();

router.use(protect);

/**
 * @swagger
 * /api/v1/wallet/deposit:
 *   post:
 *     summary: Deposit funds to wallet
 *     description: Add funds to the authenticated user's wallet
 *     tags:
 *       - Wallet
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount to deposit
 *               paymentMethod:
 *                 type: string
 *                 description: Payment method for deposit
 *     responses:
 *       200:
 *         description: Deposit successful
 *       400:
 *         description: Invalid deposit data
 *       401:
 *         description: Unauthorized - authentication required
 */
router.post('/deposit', validate(DepositSchema), depositHandler);

/**
 * @swagger
 * /api/v1/wallet/transfer:
 *   post:
 *     summary: Transfer funds to another user
 *     description: Send funds from the authenticated user's wallet to another user
 *     tags:
 *       - Wallet
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipientId:
 *                 type: string
 *                 description: ID of the recipient user
 *               amount:
 *                 type: number
 *                 description: Amount to transfer
 *               description:
 *                 type: string
 *                 description: Description or note for the transfer
 *     responses:
 *       200:
 *         description: Transfer completed successfully
 *       400:
 *         description: Invalid transfer data
 *       401:
 *         description: Unauthorized - authentication required
 */
router.post('/transfer', validate(transferSchema), transferHandler);

/**
 * @swagger
 * /api/v1/wallet/history:
 *   get:
 *     summary: Get wallet transaction history
 *     description: Retrieve paginated transaction history for the authenticated user's wallet
 *     tags:
 *       - Wallet
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page (default 10)
 *     responses:
 *       200:
 *         description: Transaction history retrieved successfully
 *       401:
 *         description: Unauthorized - authentication required
 */
router.get('/history', getHistoryHandler);

export default router;
