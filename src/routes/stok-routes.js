import express from 'express';
import StokController from '../controller/stok-controller.js';

const router = express.Router();

router.post('/', StokController.create);
router.get('/', StokController.getAll);
router.get('/:id', StokController.getById);
router.put('/:id', StokController.updateOne);
router.delete('/:id', StokController.deleteOne);

export default router;