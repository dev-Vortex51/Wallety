import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validator';
import { RequestSchema } from './request.schema';
import {
  acceptRequestHandler,
  getIncomingRequestsHandler,
  rejectRequestHandler,
  requestPaymentHandler,
} from './request.controller';

const router = Router();

router.use(protect);

/**
 * @swagger
 * /api/v1/payment-requests/request:
 *   post:
 *     summary: Request payment from another user
 *     description: Create a new payment request to be sent to another user
 *     tags:
 *       - Payment Requests
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
 *                 description: ID of the user to request payment from
 *               amount:
 *                 type: number
 *                 description: Amount to request
 *               description:
 *                 type: string
 *                 description: Description of the payment request
 *     responses:
 *       201:
 *         description: Payment request created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized - authentication required
 */
router.post('/request', validate(RequestSchema), requestPaymentHandler);

/**
 * @swagger
 * /api/v1/payment-requests/incoming:
 *   get:
 *     summary: Get all incoming payment requests
 *     description: Retrieve all payment requests received by the authenticated user
 *     tags:
 *       - Payment Requests
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of incoming payment requests retrieved successfully
 *       401:
 *         description: Unauthorized - authentication required
 */
router.get('/incoming', getIncomingRequestsHandler);

/**
 * @swagger
 * /api/v1/payment-requests/{id}/reject:
 *   patch:
 *     summary: Reject a payment request
 *     description: Reject an incoming payment request
 *     tags:
 *       - Payment Requests
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the payment request to reject
 *     responses:
 *       201:
 *         description: Payment request rejected successfully
 *       401:
 *         description: Unauthorized - authentication required
 *       404:
 *         description: Payment request not found
 */
router.patch('/:id/reject', rejectRequestHandler);

/**
 * @swagger
 * /api/v1/payment-requests/{id}/pay:
 *   patch:
 *     summary: Accept and pay a payment request
 *     description: Accept an incoming payment request and process the payment
 *     tags:
 *       - Payment Requests
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the payment request to accept
 *     responses:
 *       201:
 *         description: Payment request accepted and processed successfully
 *       401:
 *         description: Unauthorized - authentication required
 *       404:
 *         description: Payment request not found
 */
router.patch('/:id/pay', acceptRequestHandler);

export default router;
