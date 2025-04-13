// controllers/aiController.js
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getWordFromDescription = async (req, res) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ msg: "Description is required." });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You're a dictionary assistant. Suggest a word based on a user’s description." },
        { role: "user", content: `What word matches this description: "${description}"? Just give the word.` },
      ],
      temperature: 0.7,
    });

    const word = response.choices[0].message.content.trim();
    res.status(200).json({ word });
  } catch (error) {
    console.error("OpenAI error:", error.message || error);
    res.status(500).json({ msg: "Something went wrong while fetching the word." });
  }
};

module.exports = { getWordFromDescription };
