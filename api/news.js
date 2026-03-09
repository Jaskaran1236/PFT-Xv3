// api/news.js
// Fetches financial news headlines from Finnhub.
// Usage: GET /api/news           → general market news
//        GET /api/news?ticker=AAPL → company-specific news
//
// Requires: FINNHUB_API_KEY in your .env file

export default async function handler(req, res) {
  const API_KEY = process.env.FINNHUB_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'FINNHUB_API_KEY not set in environment variables' });
  }

  const { ticker } = req.query;

  try {
    let url;

    if (ticker) {
      // Company news — needs a date range (last 30 days)
      const to   = new Date().toISOString().split('T')[0];
      const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      url = `https://finnhub.io/api/v1/company-news?symbol=${encodeURIComponent(ticker)}&from=${from}&to=${to}&token=${API_KEY}`;
    } else {
      // General market news
      url = `https://finnhub.io/api/v1/news?category=general&token=${API_KEY}`;
    }

    const response = await fetch(url);
    const data     = await response.json();

    return res.status(200).json(Array.isArray(data) ? data.slice(0, 10) : []);
  } catch (error) {
    console.error('News fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch news' });
  }
}
