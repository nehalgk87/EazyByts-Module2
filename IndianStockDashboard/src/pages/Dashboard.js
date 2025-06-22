import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Dashboard = () => {
  const [symbol, setSymbol] = useState("RELIANCE");
  const [debouncedSymbol, setDebouncedSymbol] = useState("RELIANCE.NS");
  const [stockData, setStockData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [topStocks, setTopStocks] = useState([]);

  // Debounce and fetch suggestions
  useEffect(() => {
    const handler = setTimeout(() => {
      if (symbol.trim()) {
        const sym = symbol.trim().toUpperCase();
        const nseSymbol = sym.endsWith(".NS") ? sym : `${sym}.NS`;
        setDebouncedSymbol(nseSymbol);
        fetchSuggestions(sym);
      } else {
        setSuggestions([]);
      }
    }, 600);

    return () => clearTimeout(handler);
  }, [symbol]);

  // Fetch selected stock quote
  useEffect(() => {
    if (!debouncedSymbol) return;

    axios
      .get(`http://localhost:5000/api/stocks/quote/${debouncedSymbol}`)
      .then((res) => {
        setStockData(res.data);
        generateMockChartData(res.data);
      })
      .catch((err) => {
        console.error("❌ Error fetching stock:", err.message);
        setStockData(null);
        setChartData([]);
      });
  }, [debouncedSymbol]);

  // Fetch top 10 stocks
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/stocks/top-stocks")
      .then((res) => setTopStocks(res.data))
      .catch((err) => console.error("❌ Error fetching top stocks:", err.message));
  }, []);

  // Generate chart data
  const generateMockChartData = (data) => {
    const base = data.current || 1000;
    const trend = Array.from({ length: 10 }, (_, i) => ({
      name: `Day ${i + 1}`,
      price: parseFloat((base + (Math.random() - 0.5) * 40).toFixed(2)),
    }));
    setChartData(trend);
  };

  // Fetch matching symbols
  const fetchSuggestions = async (query) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/stocks/suggestions?q=${query}`);
      setSuggestions(res.data);
    } catch (err) {
      console.error("Suggestion error:", err.message);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (selected) => {
    setSymbol(selected);
    setSuggestions([]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>📝 <b>Indian Stock Dashboard</b></h2>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left/Main Section */}
        <div style={{ width: "70%", textAlign: "center" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="Enter NSE Symbol (e.g. TCS, RELIANCE)"
              style={{ padding: "10px", fontSize: "16px", width: "250px" }}
            />

            {suggestions.length > 0 && (
              <div style={{
                position: "absolute",
                top: "40px",
                left: 0,
                width: "250px",
                background: "white",
                border: "1px solid #ccc",
                zIndex: 1000,
                maxHeight: "200px",
                overflowY: "auto"
              }}>
                {suggestions.map((sug, i) => (
                  <div
                    key={i}
                    onClick={() => handleSuggestionClick(sug.symbol)}
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee"
                    }}
                  >
                    <b>{sug.symbol}</b> — {sug.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stock Info */}
          {stockData ? (
            <div style={{ marginTop: "30px" }}>
              <h3><b>{stockData.symbol}</b></h3>
              <p>Current: ₹{stockData.current}</p>
              <p>Open: ₹{stockData.open}</p>
              <p>High: ₹{stockData.high}</p>
              <p>Low: ₹{stockData.low}</p>
              <p>Prev Close: ₹{stockData.prevClose}</p>

              <div style={{ marginTop: "30px" }}>
                <h4>📊 Simulated Price Trend</h4>
                <ResponsiveContainer width="95%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#ff7300"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <p style={{ marginTop: "20px" }}>Loading stock data...</p>
          )}
        </div>

        {/* Right Sidebar */}
        <div style={{ width: "25%", paddingLeft: "20px", textAlign: "left" }}>
          <h4>🏆 <b>Top 10 NSE Stocks</b></h4>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {topStocks.map((stock, idx) => (
              <li key={idx} style={{ marginBottom: "10px" }}>
                <b>{stock.symbol}</b>: ₹{stock.current}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
