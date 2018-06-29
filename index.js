const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.resolve(__dirname, 'dist')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log('App listening on port %s', PORT);
});
