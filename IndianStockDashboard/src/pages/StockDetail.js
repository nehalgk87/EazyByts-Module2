import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const StockDetail = () => {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/stocks/quote/${symbol}`)
      .then(res => setStockData(res.data))
      .catch(err => console.error("Failed to fetch stock:", err));
  }, [symbol]);

  if (!stockData) return <p style={{ textAlign: "center" }}>📦 Loading {symbol}...</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>📈 {stockData.symbol}</h2>
      <p>Current: ₹{stockData.current}</p>
      <p>Open: ₹{stockData.open}</p>
      <p>High: ₹{stockData.high}</p>
      <p>Low: ₹{stockData.low}</p>
      <p>Previous Close: ₹{stockData.prevClose}</p>
    </div>
  );
};

export default StockDetail;
