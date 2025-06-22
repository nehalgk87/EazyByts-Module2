import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React from "react";
import Dashboard from "./pages/Dashboard";
import Watchlist from "./pages/Watchlist";
import StockDetail from "./pages/StockDetail";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <nav style={{ padding: "10px", marginBottom: "20px", background: "#f0f0f0" }}>
          <Link to="/" style={{ marginRight: "20px" }}>📊 Dashboard</Link>
          <Link to="/watchlist">📌 Watchlist</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/stock/:symbol" element={<StockDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
