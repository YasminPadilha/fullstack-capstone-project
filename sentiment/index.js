// Step 1: Import the Natural library
const natural = require("natural");
const express = require("express");

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Step 3: Create the /sentiment POST endpoint
app.post("/sentiment", (req, res) => {
  try {
    // Step 4: Extract the sentence parameter from the request body
    const { sentence } = req.body;

    if (!sentence || typeof sentence !== "string") {
      return res.status(400).json({ error: "Invalid sentence input" });
    }

    // Step 5: Process the sentiment using the Natural library
    const sentimentAnalyzer = new natural.SentimentAnalyzer(
      "English",
      natural.PorterStemmer,
      "afinn"
    );
    const sentimentScore = sentimentAnalyzer.getSentiment(sentence.split(" "));

    let sentiment = "neutral"; // Default sentiment

    // Determine sentiment based on the score
    if (sentimentScore < 0) {
      sentiment = "negative";
    } else if (sentimentScore > 0.33) {
      sentiment = "positive";
    }

    // Step 6: Implement success return state
    return res.status(200).json({
      sentimentScore: sentimentScore,
      sentiment: sentiment,
    });
  } catch (error) {
    // Step 7: Implement error return state
    console.error("Error during sentiment analysis:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while analyzing sentiment" });
  }
});

// Set the server port
const port = 3060;

// Start the server
app.listen(port, () => {
  console.log(`Sentiment Analysis Server running on port ${port}`);
});
