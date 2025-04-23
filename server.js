const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// 👇 Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Red envelope logic
let envelopes = [40, 50, 30, 35, 45, 40];
const claimedIPs = new Set();

app.get('/claim', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (claimedIPs.has(ip)) {
    return res.status(403).json({ message: "你已经抢过红包啦！" });
  }

  if (envelopes.length === 0) {
    return res.status(403).json({ message: "红包已经抢完啦！" });
  }

  const amount = envelopes.pop();
  claimedIPs.add(ip);
  res.json({ amount });
});

// 👇 Optional: fallback to index.html if needed
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});