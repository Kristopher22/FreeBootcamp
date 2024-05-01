require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

// Store URL mappings
const urlMap = new Map();
let shortUrlCounter = 1;

// Route for shortening URL
app.post("/api/shorturl", function (req, res) {
  const originalUrl = req.body.url;

  // Check if URL is valid
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  if (!urlRegex.test(originalUrl)) {
    return res.json({ error: "invalid url" });
  }

  // Shorten URL
  const shortUrl = shortUrlCounter++;
  urlMap.set(shortUrl, originalUrl);

  // Return shortened URL
  res.json({ original_url: originalUrl, short_url: shortUrl });
});

// Route for redirecting to original URL
app.get("/api/shorturl/:shortUrl", function (req, res) {
  const shortUrl = parseInt(req.params.shortUrl);

  // Check if short URL exists in the map
  if (urlMap.has(shortUrl)) {
    // Redirect to original URL
    const originalUrl = urlMap.get(shortUrl);
    res.redirect(originalUrl);
  } else {
    res.status(404).send("Short URL not found");
  }
});

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
