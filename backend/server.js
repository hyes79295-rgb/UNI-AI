import express from "express";
import cors from "cors";
import OpenAI from "openai";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/ask", async (req, res) => {
  try {
    const question = req.body.question;

    if (!question) {
      return res.status(400).json({
        error: "No question was provided."
      });
    }

    const response = await client.responses.create({
      model: "gpt-6-luna",
      instructions:
        "You are UNI, Ujjwal Neural Intelligence. " +
        "Be friendly and helpful. " +
        "For school questions, explain in simple Class 8 language. " +
        "For coding questions, explain step by step.",
      input: question
    });

    res.json({
      answer: response.output_text
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "UNI could not get an AI response."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`UNI backend running on port ${PORT}`);
});
