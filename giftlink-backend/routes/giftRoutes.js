const { ObjectId } = require("mongodb");

router.get("/:id", async (req, res) => {
  try {
    // Task 1: Connect to MongoDB and store connection to db constant
    const db = await connectToDatabase();

    // Task 2: Use the collection() method to retrieve the gift collection
    const collection = db.collection("gifts");

    const id = req.params.id;

    // Task 3: Find a specific gift by ID using the collection.findOne method
    const gift = await collection.findOne({ _id: new ObjectId(id) });

    if (!gift) {
      return res.status(404).send("Gift not found");
    }

    res.json(gift);
  } catch (e) {
    console.error("Error fetching gift:", e);
    res.status(500).send("Error fetching gift");
  }
});
