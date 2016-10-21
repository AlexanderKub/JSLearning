Date.prototype.formatDate = function () {
  var options = {
    year: "numeric", month: "numeric",
    day: "numeric", hour: "2-digit", minute: "2-digit"
  };

  return this.toLocaleTimeString("en-us", options);
};
