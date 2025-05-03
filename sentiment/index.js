require("dotenv").config();
const express = require("express");
const axios = require("axios");
const logger = require("./logger");
const expressPino = require("express-pino-logger")({ logger });
// Task 1: import the natural library
const natural = require("natural");

// Task 2: initialize the express server
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(expressPino);

// Task 3: Create a POST /sentiment endpoint
app.post("/sentiment", async (req, res) => {
  // Task 4: Extract the sentence parameter from the request body
  const { sentence } = req.body;

  // Check if the sentence exists in the request body
  if (!sentence) {
    logger.error("No sentence provided");
    return res.status(400).json({ error: "No sentence provided" });
  }

  // Initialize the sentiment analyzer with the Natural's PorterStemmer and "English" language
  const Analyzer = natural.SentimentAnalyzer;
  const stemmer = natural.PorterStemmer;
  const analyzer = new Analyzer("English", stemmer, "afinn");

  // Perform sentiment analysis
  try {
    const analysisResult = analyzer.getSentiment(sentence.split(" "));

    let sentiment = "neutral";

    // Task 5: Set sentiment to negative, positive, or neutral based on score
    if (analysisResult < 0) {
      sentiment = "negative";
    } else if (analysisResult > 0.33) {
      sentiment = "positive";
    } else {
      sentiment = "neutral";
    }

    // Logging the result
    logger.info(`Sentiment analysis result: ${analysisResult}`);

    // Task 6: Send a status code of 200 with both sentiment score and the sentiment text
    res
      .status(200)
      .json({ sentimentScore: analysisResult, sentiment: sentiment });
  } catch (error) {
    logger.error(`Error performing sentiment analysis: ${error}`);

    // Task 7: Return an HTTP code of 500 and an error message if there is an error
    res.status(500).json({ message: "Error performing sentiment analysis" });
  }
});

// Start the server
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
