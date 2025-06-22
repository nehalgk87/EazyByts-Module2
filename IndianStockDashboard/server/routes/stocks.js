const express = require("express");
const yahooFinance = require("yahoo-finance2").default;
const router = express.Router();
const { getStockList } = require("stock-nse-india");

// 🔍 Get real-time stock quote by symbol
router.get("/quote/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol.trim().toUpperCase();
    const fullSymbol = symbol.endsWith(".NS") ? symbol : `${symbol}.NS`;
    console.log("🔍 Fetching quote for:", fullSymbol);

    const quote = await yahooFinance.quote(fullSymbol);

    res.json({
      symbol: fullSymbol,
      current: quote.regularMarketPrice,
      open: quote.regularMarketOpen,
      high: quote.regularMarketDayHigh,
      low: quote.regularMarketDayLow,
      prevClose: quote.regularMarketPreviousClose,
    });
  } catch (err) {
    console.error("❌ Error fetching stock data:", err.message);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

// 🧠 Suggestions route (for dropdown)
router.get("/suggestions", async (req, res) => {
  try {
    const q = req.query.q?.trim().toUpperCase() || "";
    if (!q) return res.status(400).json({ error: "Query is required" });

    const stocks = await getStockList();
    const matches = stocks
      .filter(stock =>
        stock.symbol.toUpperCase().startsWith(q) || stock.name.toUpperCase().includes(q)
      )
      .slice(0, 10) // Limit to 10 suggestions
      .map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
      }));

    res.json(matches);
  } catch (err) {
    console.error("❌ Suggestion error:", err.message);
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});

router.get("/top-stocks", async (req, res) => {
  try {
    const topSymbols = [
      "RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS", "ICICIBANK.NS",
      "SBIN.NS", "ITC.NS", "BHARTIARTL.NS", "LT.NS", "AXISBANK.NS"
    ];

    const results = await Promise.all(
      topSymbols.map(async (symbol) => {
        try {
          const quote = await yahooFinance.quote(symbol);
          return {
            symbol,
            current: quote.regularMarketPrice,
            name: quote.shortName || symbol
          };
        } catch {
          return null;
        }
      })
    );

    res.json(results.filter(Boolean));
  } catch (err) {
    console.error("❌ Error fetching top stocks:", err.message);
    res.status(500).json({ error: "Failed to fetch top stocks" });
  }
});

module.exports = router;
