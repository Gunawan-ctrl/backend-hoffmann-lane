import express from 'express';
import TransactionController from '../controller/transaction-controller.js';

const router = express.Router();

router.post('/', TransactionController.createTransaction);
router.get('/', TransactionController.getAll);
router.get('/:id_user', TransactionController.getTransactionByIdUser);
router.post('/snap-token', TransactionController.getSnapToken);

export default router;