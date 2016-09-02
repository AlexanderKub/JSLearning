(function (exports) {
  let _this = exports;
  let $ = require("jquery");
  let FFS = require("./figuresFactory.js");
  let Tmpl = require("../Templates/form.ejs");
  let timesTmpl = require("../Templates/timesForm.ejs");
  let window = require("../Templates/window.ejs");
  let TmplParams = require("../Templates/paramsForm.ejs");
  let figurePageTemplate = require("../Templates/figurePage.ejs");
  
  _this.Div = $("<div id='figurePage' class='page'></div>");
  _this.Div.append(figurePageTemplate());
  
  const canvas = _this.Div.find("#canvas").get(0);
  let FiguresFactory = FFS.FiguresFactory(canvas);
  
  let figure;
  
  _this.Init = function(){
    _this.Div.find("#CreateFigure").on("click", function () {
      ShowForm();
    });
    
    _this.Div.find("#IncreaseFigure").on("click", function () {
      ShowTimesForm(0);
    });
    
    _this.Div.find("#DecreaseFigure").on("click", function () {
      ShowTimesForm(1);
    });
    
    _this.Div.find("#GetAreaFigure").on("click", function () {
      ShowWindow(figure.getArea().toFixed(2));
    });
    
    _this.Div.find("#IncreaseFigure").prop("disabled", !(figure));
    _this.Div.find("#DecreaseFigure").prop("disabled", !(figure));
    _this.Div.find("#GetAreaFigure").prop("disabled", !(figure));
     
    ClearContainer();
  };

  function ShowForm(){
    _this.Div.find("#Container").html(Tmpl());
    _this.Div.find("#Container").show();
    ShowParams();
    _this.Div.find("#FigureSelect").on("change",function () {
      ShowParams();
    });
  }

  function ShowParams(){
    _this.Div.find("#FigureParams").html(TmplParams({typ:_this.Div.find("#FigureSelect").val(),}));
    _this.Div.find("#FigureBtn").on("click", function() {
      let typ = _this.Div.find("#FigureSelect").val();
    
      let x = _this.Div.find("#FigureX").val();
      let y = _this.Div.find("#FigureY").val();
      let w = _this.Div.find("#FigureW").val();
      let h = _this.Div.find("#FigureH").val();
      let r = _this.Div.find("#FigureR").val();
      
      if(typ=="Sqr") figure = FiguresFactory.createSquare(x,y,w);
      if(typ=="Rec") figure = FiguresFactory.createRectangle(x,y,w,h);
      if(typ=="Cir") figure = FiguresFactory.createCircle(x,y,r);
      figure.render();
  
      _this.Div.find("#IncreaseFigure").prop("disabled",false);
      _this.Div.find("#DecreaseFigure").prop("disabled",false);
      _this.Div.find("#GetAreaFigure").prop("disabled",false);
    
      ClearContainer();
    });
  }

  function ShowTimesForm(a){
    _this.Div.find("#Container").html(timesTmpl({text:a==0?"Увеличить":"Уменьшить",}));
    _this.Div.find("#Container").show();
    _this.Div.find("#TimesBtn").on("click", function() {
      let times = _this.Div.find("#TimesVal").val();
      if(a==0)
        figure.increase(times);
      else
        figure.decrease(times);
      ClearContainer();
    });
  }

  function ShowWindow(a){
    _this.Div.find("#Container").html(window({cont:"Площадь: "+a,}));
    _this.Div.find("#Container").show();
    _this.Div.find("#WindowBtn").on("click", function() {
      ClearContainer();
    });
  }

  function ClearContainer(){
    _this.Div.find("#Container").html("");
    _this.Div.find("#Container").hide();
  }
  
  _this.HTML = function () {
    _this.Init();
    return _this.Div;
  };
  
})(typeof exports === "undefined" ? this["figurePage"] = {} : exports);
