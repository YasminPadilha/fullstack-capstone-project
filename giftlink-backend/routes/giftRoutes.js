const express = require("express");
const router = express.Router(); // This is where you define the router
const connectToDatabase = require("../models/db");

// Get all gifts
router.get("/", async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("gifts");
    const gifts = await collection.find({}).toArray(); // Get all gifts
    res.json(gifts);
  } catch (error) {
    next(error);
  }
});

// Get a single gift by ID
router.get("/:id", async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("gifts");
    const gift = await collection.findOne({
      _id: new require("mongodb").ObjectId(req.params.id),
    });

    if (!gift) {
      return res.status(404).json({ message: "Gift not found" });
    }

    res.json(gift);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
