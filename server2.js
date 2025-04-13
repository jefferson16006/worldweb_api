// server.js

const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Route to handle reverse dictionary using Datamuse
app.post('/reverse-dictionary', async (req, res) => {
  const { definition } = req.body;

  if (!definition) {
    return res.status(400).json({ error: 'Definition is required' });
  }

  try {
    const response = await axios.get('https://api.datamuse.com/words', {
      params: {
        ml: definition // "ml" means "means like"
      }
    });

    // Return top suggestions
    const suggestions = response.data.map((item) => item.word);
    res.json({ suggestions });
  } catch (error) {
    console.error('Error contacting Datamuse API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
