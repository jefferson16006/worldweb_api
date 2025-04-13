// server.js

const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Hugging Face API Key
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

// Check if API key exists
if (!HUGGING_FACE_API_KEY) {
  console.error('Error: Hugging Face API key not found in environment variables.');
  process.exit(1);
}

// Route to handle the reverse dictionary
app.post('/reverse-dictionary', async (req, res) => {
  const { definition } = req.body;

  if (!definition) {
    return res.status(400).json({ error: 'Definition is required in the request body.' });
  }

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/bert-base-uncased', // Change to a better instruction-following model
      {
        inputs: `What is a single English word for: "${definition}"?`,
      },
      {
        headers: {
          Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
        },
      }
    );

    // Extract and clean response
    const rawOutput = response.data?.[0]?.generated_text || 'No result';
    const word = rawOutput.split('\n')[0].trim();

    res.json({ word });
  } catch (error) {
    console.error('Error contacting Hugging Face API:', error.message);
    res.status(500).json({ error: 'Failed to fetch response from Hugging Face API.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const warmup = async () => {
    try {
      await axios.post(
        'https://api-inference.huggingface.co/models/bert-base-uncased',
        { inputs: 'What is a single word for happiness that lasts?' },
        { headers: { Authorization: `Bearer ${HUGGING_FACE_API_KEY}` } }
      );
      console.log('Model warmed up');
    } catch (err) {
      console.log('Model warming failed (might still be sleeping):', err.message);
    }
  };
  warmup();
  
