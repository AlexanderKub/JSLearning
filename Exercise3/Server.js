const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 3000;
const SDB = require('./ServerDB');

// parse application/json
app.use(express.static(__dirname + '/'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/index.html', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
  console.log('Server running on '+PORT);
});