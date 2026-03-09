// api/stock.js
// Fetches the current price of a stock ticker from Yahoo Finance.
// Usage: GET /api/stock?ticker=AAPL

export default async function handler(req, res) {
  const { ticker } = req.query;

  if (!ticker) {
    return res.status(400).json({ error: 'Ticker required' });
  }

  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(ticker)}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'application/json',
        },
      }
    );

    const data   = await response.json();
    const result = data?.quoteResponse?.result;

    if (!result || result.length === 0) {
      return res.status(404).json({ error: 'Ticker not found' });
    }

    const price = result[0].regularMarketPrice;

    return res.status(200).json({ ticker, price });
  } catch (error) {
    console.error('Stock fetch error:', error);
    return res.status(500).json({ error: 'Price fetch failed' });
  }
}
