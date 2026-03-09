# PFT-X — Personal Financial Terminal

A luxury-styled personal finance dashboard with live stock prices, portfolio tracking, AI-powered chart analysis, watchlist, price alerts, and market news.

---

## Features

- **Portfolio tracker** — add positions, track P&L, allocation donut chart, Monte Carlo simulation
- **5-Year stock chart** — click any ticker to open a slide-in panel with 5 years of price history
- **AI Peak/Trough analysis** — click a ◆ marker on the chart and Claude explains the real-world event that drove that move
- **Watchlist** — monitor stocks without holding them, with live price updates
- **Price alerts** — set a target price and direction; triggers a browser notification + in-app banner
- **Market heatmap** — visual grid of market movers (click to open chart)
- **News feed** — live financial headlines from Finnhub, both general and per-stock
- **Hedge Fund Tracker** — curated positions from major funds
- **Live ticker bar** — scrolling price strip at the top of the page

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | Vanilla HTML/CSS/JS + Chart.js      |
| Backend   | Vercel Serverless Functions (Node)  |
| Stock data| Yahoo Finance (free, no key needed) |
| News      | Finnhub API (free tier)             |
| AI        | Anthropic Claude API                |
| Hosting   | Vercel                              |

---

## Project Structure

```
pft-x/
├── public/
│   └── index.html        ← entire frontend (self-contained)
├── api/
│   ├── stock.js          ← GET  /api/stock?ticker=AAPL
│   ├── history.js        ← GET  /api/history?ticker=AAPL
│   ├── news.js           ← GET  /api/news[?ticker=AAPL]
│   └── explain.js        ← POST /api/explain
├── .env.example          ← copy to .env and fill in keys
├── .gitignore
├── package.json
├── vercel.json
└── README.md
```

---

## Setup & Deployment

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/pft-x.git
cd pft-x
```

### 2. Get your API keys

| Key | Where to get it | Cost |
|-----|----------------|------|
| `FINNHUB_API_KEY` | [finnhub.io](https://finnhub.io) — sign up, copy key from dashboard | Free tier (60 req/min) |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) | Pay per use (~$0.001/explanation) |

### 3. Set up environment variables

```bash
cp .env.example .env
# Edit .env and paste your keys
```

### 4. Deploy to Vercel (recommended)

```bash
npm install
npm run deploy
```

Then go to your Vercel project → **Settings → Environment Variables** and add:
- `FINNHUB_API_KEY`
- `ANTHROPIC_API_KEY`

### 5. Local development

```bash
npm install
npm run dev
# → http://localhost:3000
```

---

## Notes

- Yahoo Finance is used for live prices and history — no API key needed, but it may rate-limit heavy usage
- The heatmap and ticker bar use simulated % changes (Yahoo Finance doesn't provide intraday change % easily without a paid plan)
- The AI explanation feature calls Claude once per click — very cheap but requires the Anthropic key
- All data refreshes automatically: prices every 15s, news every 60s, heatmap every 30s

---

## License

MIT
