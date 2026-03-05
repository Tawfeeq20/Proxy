const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

app.options('*', cors());

app.all('/proxy', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({error: 'No URL'});
  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: req.method !== 'GET' && req.method !== 'OPTIONS' 
        ? JSON.stringify(req.body) 
        : undefined
    });
    const data = await response.json();
    res.json(data);
  } catch(e) {
    res.status(500).json({error: e.message});
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Proxy running on port ' + PORT));
