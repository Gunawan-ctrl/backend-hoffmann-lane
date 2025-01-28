// filepath: /d:/My Project/07. Hoffmann Lane/backend-hoffman-lane/src/routes/routes.js
import express from 'express';
import qrcodeController from '../controller/qrcode-controller.js';

const router = express.Router();

router.post('/generate-qrcode', qrcodeController.createQrCode);
router.get('/', qrcodeController.getAll);
router.delete('/:id', qrcodeController.deleteOne);

export default router;