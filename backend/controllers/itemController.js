import asyncHandler from "express-async-handler";
import Item from "../models/itemModel.js";

// @desc  Get all items for the logged-in user (supports ?search=)
// @route GET /api/items
export const getItems = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id };

  if (req.query.search) {
    // Escape regex metacharacters so a search for "(" can't crash the query.
    const safe = String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.name = { $regex: safe, $options: "i" };
  }

  const items = await Item.find(filter).sort({ createdAt: -1 });
  res.status(200).json(items);
});

// @desc  Create a new item
// @route POST /api/items
export const createItem = asyncHandler(async (req, res) => {
  const { name, purchasePrice, sellingPrice, stock } = req.body || {};

  // NOTE: a plain `!purchasePrice` check wrongly rejects the valid value 0.
  if (
    !name ||
    !String(name).trim() ||
    purchasePrice == null ||
    sellingPrice == null ||
    stock == null
  ) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  const purchase = Number(purchasePrice);
  const selling = Number(sellingPrice);
  const qty = Number(stock);

  if ([purchase, selling, qty].some((n) => Number.isNaN(n) || n < 0)) {
    res.status(400);
    throw new Error("Prices and stock must be non-negative numbers");
  }

  const item = await Item.create({
    name: String(name).trim(),
    purchasePrice: purchase,
    sellingPrice: selling,
    stock: qty,
    user: req.user._id,
  });

  res.status(201).json(item);
});

// @desc  Update an item
// @route PUT /api/items/:id
export const updateItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }

  if (item.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to update this item");
  }

  // Never let the request body reassign ownership of the item.
  const { user, _id, ...safeUpdates } = req.body || {}; // eslint-disable-line no-unused-vars

  const updated = await Item.findByIdAndUpdate(req.params.id, safeUpdates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(updated);
});

// @desc  Delete an item
// @route DELETE /api/items/:id
export const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }

  if (item.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to delete this item");
  }

  await item.deleteOne();
  res.status(200).json({ message: "Item deleted", id: req.params.id });
});
