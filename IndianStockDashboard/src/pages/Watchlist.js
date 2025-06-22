import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const fetchWatchlist = () => {
    axios
      .get("http://localhost:5000/api/watchlist")
      .then((res) => setWatchlist(res.data.watchlist))
      .catch((err) => console.error(err));
  };

  const addSymbol = () => {
    const trimmed = input.trim().toUpperCase();
    if (!trimmed) return;

    axios
      .post("http://localhost:5000/api/watchlist/add", { symbol: trimmed })
      .then(() => {
        fetchWatchlist();
        setInput("");
        setSuggestions([]);
      })
      .catch((err) => alert(err.response?.data?.error || "Failed to add"));
  };

  const removeSymbol = (symbol) => {
    axios
      .post("http://localhost:5000/api/watchlist/remove", { symbol })
      .then(fetchWatchlist)
      .catch((err) => console.error(err));
  };

  const goToStock = (symbol) => {
    navigate(`/stock/${symbol}`);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);

    if (val.trim().length >= 2) {
      // Mocked symbol suggestion. Replace with live API if needed.
      const allSymbols = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK", "SBIN", "WIPRO", "HINDUNILVR", "BAJFINANCE", "ITC"];
      const filtered = allSymbols.filter((s) => s.startsWith(val.toUpperCase()));
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>📌 My Watchlist</h2>
      <input
        type="text"
        placeholder="Add NSE Symbol"
        value={input}
        onChange={handleInputChange}
        style={{ padding: "8px" }}
      />
      <button onClick={addSymbol} style={{ marginLeft: "10px", padding: "8px" }}>
        Add
      </button>

      {suggestions.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, marginTop: "10px", background: "#f2f2f2", borderRadius: "5px" }}>
          {suggestions.map((s, i) => (
            <li
              key={i}
              style={{ cursor: "pointer", padding: "5px" }}
              onClick={() => {
                setInput(s);
                setSuggestions([]);
              }}
            >
              {s}
            </li>
          ))}
        </ul>
      )}

      <ul style={{ listStyle: "none", marginTop: "20px", padding: 0 }}>
        {watchlist.map((symbol, idx) => (
          <li key={idx} style={{ marginBottom: "10px" }}>
            <span
              onClick={() => goToStock(symbol)}
              style={{ cursor: "pointer", color: "#007bff", fontWeight: "bold" }}
            >
              {symbol}
            </span>{" "}
            <button
              onClick={() => removeSymbol(symbol)}
              style={{ color: "red", marginLeft: "10px" }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Watchlist;
