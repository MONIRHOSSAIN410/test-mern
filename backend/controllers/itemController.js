import asyncHandler from "express-async-handler";
import Item from "../models/itemModel.js";


// Get all items for logged-in user
export const getItems = asyncHandler(async (req, res) => {
  const items = await Item.find({ user: req.user.id });
  res.status(200).json(items);
});


// Create a new item
export const createItem = asyncHandler(async (req, res) => {
  const { name, purchasePrice, sellingPrice, stock } = req.body;

  if (!name || !purchasePrice || !sellingPrice || stock == null) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  const item = await Item.create({
    name,
    purchasePrice,
    sellingPrice,
    stock,
    user: req.user.id,
  });

  res.status(201).json(item);
});


// Update an item
export const updateItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }

  // Ensure the user owns the item
  if (item.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized to update this item");
  }

  const updated = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updated);
});


// Delete an item
export const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }

  if (item.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized to delete this item");
  }

  await item.deleteOne();
  res.status(200).json({ message: "Item deleted" });
});
