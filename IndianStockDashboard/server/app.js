// server/app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const stockRoutes = require("./routes/stocks");
const watchlistRoutes = require("./routes/watchlist");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/stocks", stockRoutes);
app.use("/api/watchlist", watchlistRoutes);

app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});
