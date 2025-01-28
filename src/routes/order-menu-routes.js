import express from "express";
import orderMenuController from "../controller/order-menu-controller.js";

const router = express.Router();

router.post("/", orderMenuController.create);
router.get("/", orderMenuController.getAll);
router.put("/:id", orderMenuController.updateOne);
router.delete("/:id", orderMenuController.deleteOne);

export default router;