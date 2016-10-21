Date.prototype.ToPrettyString = function (str) {
  var options = {
    year: "numeric", month: "numeric",
    day: "numeric", hour: "2-digit", minute: "2-digit"
  };

  return new Date(str).toLocaleTimeString("en-us", options);
};
