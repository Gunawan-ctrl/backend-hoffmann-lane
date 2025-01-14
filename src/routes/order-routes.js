import express from "express";
import orderController from "../controller/order-controller.js";

const router = express.Router();

router.post("/", orderController.create);
router.get("/", orderController.getAll);
// router.get("/:id", orderController.getById);
router.get("/:id_user", orderController.getByIdUser);
router.put("/:id", orderController.updateOne);
router.delete("/:id", orderController.deleteOne);

export default router;