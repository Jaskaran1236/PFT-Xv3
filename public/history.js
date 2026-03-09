export default async function handler(req, res) {
  const { ticker } = req.query;

  if (!ticker) {
    return res.status(400).json({ error: "Ticker required" });
  }

  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1mo&range=5y`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "application/json",
        },
      }
    );

    const data = await response.json();

    const result = data?.chart?.result?.[0];

    if (!result) {
      return res.status(404).json({ error: "No data found for ticker" });
    }

    const timestamps = result.timestamp;
    const closes     = result.indicators.quote[0].close;
    const name       = result.meta?.shortName || ticker;

    const points = timestamps
      .map((ts, i) => ({
        date:  new Date(ts * 1000).toISOString().substring(0, 7),
        price: closes[i] ? parseFloat(closes[i].toFixed(2)) : null,
      }))
      .filter((p) => p.price !== null);

    return res.status(200).json({ ticker, name, points });
  } catch (err) {
    console.error("History fetch error:", err);
    return res.status(500).json({ error: "Failed to fetch history" });
  }
}
