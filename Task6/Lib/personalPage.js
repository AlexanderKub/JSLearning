(function (exports) {
  let _this = exports;
  let $ = require("jquery");
  
  _this.Div = $("<div id='personalPage' class='page'></div>");
  
  _this.Init = function () {
    _this.Div.html("TEST");
  };
  
  _this.HTML = function () {
    _this.Init();
    return _this.Div;
  };
})(typeof exports === "undefined" ? this["personalPage"] = {} : exports);
