import express from 'express';
import ReservationController from '../controller/reservation-controller.js';

const router = express.Router();

router.post('/', ReservationController.create);
router.get('/', ReservationController.getAll);
router.get('/:id', ReservationController.getById);
router.put('/:id', ReservationController.updateOne);
router.delete('/:id', ReservationController.deleteOne);

export default router;