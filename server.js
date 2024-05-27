const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const server = http.createServer(app);
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/all-projects', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'all-projects.html'));
});


const hostname = '0.0.0.0'; 
const port = 3000;

app.listen(port, hostname, () => {
  console.log(`Server listening on http://${hostname}:${port}/ ...`);
});
