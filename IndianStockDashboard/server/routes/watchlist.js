// server/routes/watchlist.js
const express = require("express");
const router = express.Router();
const yahooFinance = require("yahoo-finance2").default;

let watchlist = []; // In-memory storage (MongoDB can replace this later)

// ➕ Add stock to watchlist
router.post("/add", async (req, res) => {
  const { symbol } = req.body;

  if (!symbol || typeof symbol !== "string" || symbol.trim() === "") {
    return res.status(400).json({ error: "Symbol is required" });
  }

  const upperSymbol = symbol.trim().toUpperCase();
  const nseSymbol = upperSymbol.endsWith(".NS") ? upperSymbol : `${upperSymbol}.NS`;

  if (watchlist.includes(upperSymbol)) {
    return res.status(409).json({ error: "Stock is already in watchlist" });
  }

  try {
    const quote = await yahooFinance.quote(nseSymbol);

    if (!quote || !quote.regularMarketPrice) {
      return res.status(404).json({ error: "Invalid NSE stock symbol" });
    }

    watchlist.push(upperSymbol);
    res.json({ message: "✅ Stock added to watchlist", watchlist });
  } catch (err) {
    console.error("❌ Error validating symbol:", err.message);
    res.status(500).json({ error: "Failed to validate stock symbol" });
  }
});

// 📋 Get watchlist
router.get("/", (req, res) => {
  res.json({ watchlist });
});

// ❌ Remove from watchlist
router.post("/remove", (req, res) => {
  const { symbol } = req.body;

  if (!symbol) {
    return res.status(400).json({ error: "Symbol is required to remove" });
  }

  const upperSymbol = symbol.trim().toUpperCase();
  watchlist = watchlist.filter(s => s !== upperSymbol);
  res.json({ message: "🗑️ Removed from watchlist", watchlist });
});

module.exports = router;
