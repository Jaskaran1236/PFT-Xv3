// api/explain.js
// Uses Claude to explain why a stock hit a peak or trough at a given date.
// Usage: POST /api/explain
// Body: { ticker, date, price, type }  (type = "peak" | "trough")
//
// Requires: ANTHROPIC_API_KEY in your .env file

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const API_KEY = process.env.ANTHROPIC_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set in environment variables' });
  }

  const { ticker, date, price, type } = req.body;

  if (!ticker || !date || !type) {
    return res.status(400).json({ error: 'Missing required fields: ticker, date, type' });
  }

  const directionLabel = type === 'peak'
    ? `reach a significant peak near $${parseFloat(price).toFixed(2)}`
    : `fall to a significant low near $${parseFloat(price).toFixed(2)}`;

  const prompt = `You are a financial analyst. Explain in exactly 2–3 concise sentences why ${ticker} stock ${directionLabel} around ${date}. Cite the specific real-world catalyst — such as earnings beats/misses, product launches, macro events, regulatory changes, CEO announcements, or broader market conditions. Be factual and specific. Do not use bullet points.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':    'application/json',
        'x-api-key':       API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-opus-4-5',
        max_tokens: 220,
        messages:   [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();

    if (!data.content || !data.content[0]) {
      return res.status(500).json({ error: 'No response from Claude' });
    }

    return res.status(200).json({ explanation: data.content[0].text });
  } catch (error) {
    console.error('Explain API error:', error);
    return res.status(500).json({ error: 'Failed to fetch explanation' });
  }
}
