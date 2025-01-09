import express from 'express';
import KategoriController from '../controller/kategori-controller.js';

const router = express.Router();

router.post('/', KategoriController.create);
router.get('/', KategoriController.getAll);
router.get('/:id', KategoriController.getById);
router.put('/:id', KategoriController.updateOne);
router.delete('/:id', KategoriController.deleteOne);

export default router;