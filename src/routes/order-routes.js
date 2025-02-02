import express from "express";
import orderController from "../controller/order-controller.js";

const router = express.Router();

router.post("/", orderController.createOrder);
router.get("/", orderController.getAll);
router.get("/total", orderController.getTotal);
router.get("/summary", orderController.getOrderSummary);
router.get("/most-ordered", orderController.getMostOrderedItems);
router.get("/:id", orderController.getById);
router.put("/:id", orderController.updateOne);
router.delete("/:id", orderController.deleteOne);

export default router;