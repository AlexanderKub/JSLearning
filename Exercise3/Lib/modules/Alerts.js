var $ = require("jquery");
module.exports = function(parent,text){
  var alerts = $(".alert");
  for (var i = 0; i < alerts.length; i++) $(alerts[i]).remove();
  var element = document.createElement("div");
  element.className = "alert";
  element.innerHTML = text;
  $(parent).append(element);
};
