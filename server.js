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


app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000/ ...');
});
