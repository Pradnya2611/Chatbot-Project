import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Initialize OpenAI client pointing to OpenRouter
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY, // <-- Use OpenRouter key
  baseURL: "https://openrouter.ai/api/v1", // <-- OpenRouter endpoint
});

app.use(cors());
app.use(express.json());

app.post("/chatbot", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      console.error("OpenRouter API key is missing");
      return res.status(500).json({
        error: "OpenRouter API key is not configured",
        details: "Please check your .env file configuration",
      });
    }

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: question },
        ],
        model: "gpt-4o-mini", // <-- you can choose any OpenRouter-supported model
      });

      // Send the text response back
      res.json(completion.choices[0].message.content);
    } catch (apiError) {
      console.error("OpenRouter API Error:", apiError);
      res
        .status(500)
        .json({ error: "OpenRouter API error", details: apiError.message });
    }
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      error: "An error occurred while processing your request.",
      details: error.message,
    });
  }
});

app.get("/test", (req, res) => {
  res.json({ message: "Server is running properly!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
