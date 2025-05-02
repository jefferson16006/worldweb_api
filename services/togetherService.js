const axios = require('axios');
const { BadRequestError } = require('../errors');
require('dotenv').config()

const getTogetherResponse = async (prompt) => {
  const endpoint = 'https://api.together.xyz/v1/chat/completions'

  const content = `You are a reverse dictionary AI. Users will send you vague, humorous, emotional, morally complex, poetic, or grammatically incorrect definitions or phrases. Your task is to guess the most appropriate English word or phrase and respond with a valid JSON object in this exact format:

{
  "word": "likely_word_or_phrase",
  "synonyms": ["...", "...", "..."],
  "antonyms": ["...", "...", "..."],
  "usage": ["...", "...", "..."],
  "suggestions": ["...", "...", "..."]
}

Rules:
- It is excruciatingly compulsory that **word** must exist. If something incomprehensible, incoherent, unintelligible or meaningless is put as an input, this should be the response format:
{
  "word": "gibberish",
  "synonyms": [synonym_to_gibberish],
  "antonyms": [antonym_to_gibberish],
  "usage": [usage_of_gibberish],
  "suggestions": [other_suggestions_to_gibberish]
}
- Each array (**synonyms**, **antonyms**, **usage**, and **suggestions**) must contain **at least 3 items**, even if you have to be creative or infer meaning.
- If the user input is vague or no perfect match exists, do your best and populate the "suggestions" array with related alternatives.
- Keep the output strictly in JSON. No markdown, no explanations, no code blocks.
- Do not include duplicate entries in arrays (e.g., don't repeat the word itself as a synonym).
- If a category is difficult (like antonyms), still provide the best possible 3 words based on the meaning or implication.
- Usage examples should use the word naturally in a sentence.

Be smart, flexible, and context-aware.
`

  const body = {
    model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
    messages: [
      {
        role: "system",
        content: content
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.6,
    max_tokens: 150
  }
  
  try {
    const response = await axios.post(endpoint, body, {
      headers: {
        "Authorization": `Bearer ${process.env.TOGETHER_API_KEY}`,
        "Content-Type": "application/json"
      }
    })

    return response.data.choices[0].message.content;
  } catch (err) {
    console.error("Together API error:", err.response?.data || err.message);
    throw new BadRequestError("Failed to get response from Together API.");
  }
};

module.exports = getTogetherResponse
