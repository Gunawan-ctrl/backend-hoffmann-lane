import express from "express";
import orderController from "../controller/order-controller.js";

const router = express.Router();

router.post("/", orderController.createOrder);
router.get("/", orderController.getAll);
router.put("/:id", orderController.updateOne);
router.delete("/:id", orderController.deleteOne);

export default router;