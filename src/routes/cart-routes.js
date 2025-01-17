import express from 'express';
import cartController from '../controller/cart-controller.js';

const router = express.Router();

router.post('/', cartController.create);
router.get('/', cartController.getAll);
router.get('/:id_user', cartController.getByIdUser);
router.put('/:id', cartController.updateOne);
router.delete('/:id', cartController.deleteOne);

export default router;