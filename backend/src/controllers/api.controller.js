import axios from 'axios';

export const entryCategory = async (req, res) => {
  const { text, amount } = req.body;

  try {
    const prompt = `You are an AI assistant that categorizes financial transactions.
Given a transaction description and an amount, assign the most appropriate category from the following list:
Food, Transport, Utilities, Entertainment, Shopping, Health, Other.

Respond with only the category name.

Description: ${text}
Amount: ${amount}`;

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 50,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_KEY}`
      }
    });

    const category = response.data.choices[0].message.content.trim();
    return res.json({ category });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: error.message });
  }
}