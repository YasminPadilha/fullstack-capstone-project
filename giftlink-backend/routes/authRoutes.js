require("dotenv").config();
const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const connectToDatabase = require("../models/db");
const pino = require("pino");

const router = express.Router();
const logger = pino(); // Create a Pino logger instance

const JWT_SECRET = process.env.JWT_SECRET; // Get JWT secret key from environment variables

// User Registration Route
router.post(
  "/register",
  [
    // Validation checks
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password should be at least 6 characters").isLength({
      min: 6,
    }),
    body("firstName", "First Name is required").notEmpty(),
    body("lastName", "Last Name is required").notEmpty(),
  ],
  async (req, res) => {
    // Task 1: Validate input fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Task 2: Connect to MongoDB
      const db = await connectToDatabase();

      // Task 3: Access MongoDB collection
      const collection = db.collection("users");

      // Task 4: Check for existing email
      const existingEmail = await collection.findOne({ email: req.body.email });
      if (existingEmail) {
        return res
          .status(400)
          .json({ msg: "User already exists with this email" });
      }

      // Task 5: Hash the password
      const salt = await bcryptjs.genSalt(10);
      const hash = await bcryptjs.hash(req.body.password, salt);

      // Task 6: Save user details in the database
      const newUser = await collection.insertOne({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hash,
        createdAt: new Date(),
      });

      // Task 7: Create JWT authentication token
      const payload = {
        user: {
          id: newUser.insertedId,
        },
      };
      const authtoken = jwt.sign(payload, JWT_SECRET);

      logger.info("User registered successfully");

      // Task 8: Return the auth token and user email
      res.json({ authtoken, email: req.body.email });
    } catch (e) {
      logger.error("Error registering user:", e);
      return res.status(500).send("Internal server error");
    }
  }
);

module.exports = router;
