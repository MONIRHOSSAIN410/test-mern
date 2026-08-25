import express from "express";
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/itemController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes protected
router.route("/")
  .get(protect, getItems)       // GET all items
  .post(protect, createItem);   // POST new item

router.route("/:id")
  .put(protect, updateItem)     // PUT update item
  .delete(protect, deleteItem); // DELETE item

export default router;
