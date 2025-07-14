const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/summarize", async (req, res) => {
  const { text, strength } = req.body;
  if (!text || !strength) {
    return res.status(400).json({ error: "Missing text or strength" });
  }
  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-pro" });
    const prompt = `Summarize this in a ${strength} way: ${text}`;
    const result = await model.generateContent(prompt);
    const summary = result.response.text();
    res.json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to summarize" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
