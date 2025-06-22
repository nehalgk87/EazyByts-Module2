import React, { useEffect, useState } from "react";
import axios from "axios";

const Portfolio = () => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/watchlist/all")
      .then((res) => setWatchlist(res.data))
      .catch(() => setWatchlist([]));
  }, []);

  const removeStock = (symbol) => {
    axios.delete(`http://localhost:5000/api/watchlist/delete/${symbol}`).then(() => {
      setWatchlist(watchlist.filter(item => item.symbol !== symbol));
    });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>📁 <b>Your Stock Wishlist</b></h2>
      {watchlist.length === 0 ? (
        <p>No stocks saved yet.</p>
      ) : (
        <ul>
          {watchlist.map((item) => (
            <li key={item._id} style={{ margin: "10px" }}>
              <b>{item.symbol}</b>
              <button onClick={() => removeStock(item.symbol)} style={{ marginLeft: "10px" }}>
                ❌ Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Portfolio;
