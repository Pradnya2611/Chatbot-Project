import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3005;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
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
      console.error("OpenAI API key is missing");
      return res.status(500).json({
        error: "OpenAI API key is not configured",
        details: "Please check your .env file configuration",
      });
    }

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: question },
        ],
        model: "gpt-3.5-turbo",
      });
      res.json(completion.choices[0].message.content);
    } catch (apiError) {
      console.error("OpenAI API Error:", apiError);
      res.status(500).json({
        error: "OpenAI API error",
        details: apiError.message,
      });
    }
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      error: "An error occurred while processing your request.",
      details: error.message,
    });
  }
});

// Add a test route
app.get("/test", (req, res) => {
  res.json({ message: "Server is running properly!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
