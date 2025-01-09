import express from 'express';
import MenuController from '../controller/menu-controller.js';
import upload from '../middleware/uploadConfig.js';
import statusMiddleware from '../middleware/statusMiddleware.js';

const router = express.Router();

router.post("/", upload.single("upload_menu"), statusMiddleware, MenuController.create);
router.get('/', statusMiddleware, MenuController.getAll);
router.get('/:id', MenuController.getById);
router.get('/category/:idKategori', MenuController.getByIdKategori);
router.get('/status/:status', MenuController.getByStatus);
router.patch('/:id', MenuController.updateStatus);
router.put('/:id', upload.single("upload_menu"), MenuController.updateOne);
router.delete('/:id', MenuController.deleteOne);

export default router;
