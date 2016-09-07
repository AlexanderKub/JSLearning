const express = require("express");
const app = express();
require("body-parser");
const PORT = 4000;

// parse application/json
app.use(express.static(__dirname + "/"));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.get("/index.html", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.listen(PORT, function(){
  console.log("Server running on "+PORT);
});

