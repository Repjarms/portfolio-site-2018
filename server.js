const server = require('./index');

const PORT = 3000;

server.listen(PORT, () => {
  console.log('App listening on port %s', PORT);
});
