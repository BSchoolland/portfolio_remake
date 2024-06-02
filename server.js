const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const server = https.createServer(app); // Ensure your server also supports HTTPS if needed
require('dotenv').config();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/all-projects', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'all-projects.html'));
});

const hostname = '0.0.0.0'; 
const port = process.env.PORT || 3000; // Use environment variable for port or default to 3000

// Function to ping Heroku app
function pingHerokuApp() {
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  // Only ping between 8 AM and 11 PM (8-23 inclusive)
  if (currentHour >= 8 && currentHour < 23) {
    console.log('Pinging Heroku App to keep awake...');
    https.get('https://www.communityali.org', (res) => {
      console.log(`STATUS: ${res.statusCode}`);
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
    });
  }
}

pingHerokuApp()
// Schedule to ping every 5 minutes
setInterval(pingHerokuApp, 5 * 60 * 1000);

app.listen(port, hostname, () => {
  console.log(`Server listening on http://${hostname}:${port}/ ...`);
});
