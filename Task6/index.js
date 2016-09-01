  require("./CSS/style.css");
  let $ = require("jquery");
  let Tmpl = require("./Templates/form.ejs");
  let timesTmpl = require("./Templates/timesForm.ejs");
  let window = require("./Templates/window.ejs");
  let TmplParams = require("./Templates/paramsForm.ejs");
  
  const canvas = $("#canvas").get(0);
  const ctx = canvas.getContext("2d");
  let color = "red";
  ctx.fillStyle = color;
  
  class Figure {
    constructor(x,y) {
      this.x = parseFloat(x)+325;
      this.y = parseFloat(y)+250;
    }
    
    render(){
      canvas.width = canvas.width;
      ctx.fillStyle = color;
    }
  }
  
  class Square extends Figure {
    constructor(x,y,w) {
      super(x,y);
      this.width = w;
    }
    
    increase(times){
      let oldw = this.width;
      this.width*=times;
      this.x-=(this.width-oldw)/2;
      this.y-=(this.width-oldw)/2;
      this.render();
    }
    
    decrease(times){
      let oldw = this.width;
      this.width/=times;
      this.x+=(oldw-this.width)/2;
      this.y+=(oldw-this.width)/2;
      this.render();
    }
    
    getArea(){
      return this.width*this.width;
    }

    render(){
      super.render();
      ctx.fillRect(this.x, this.y, this.width, this.width);
    }
  }

  class Rectangle extends Figure {
    constructor(x,y,w,h) {
      super(x,y);
      this.width = w;
      this.height = h;
    }
	
    increase(times){
      let oldw = this.width;
      let oldh = this.height;
      this.width*=times;
      this.height*=times;
      this.x-=(this.width-oldw)/2;
      this.y-=(this.height-oldh)/2;
      this.render();
    }
    
    decrease(times){
      let oldw = this.width;
      let oldh = this.height;
      this.width/=times;
      this.height/=times;
      this.x+=(oldw-this.width)/2;
      this.y+=(oldh-this.height)/2;
      this.render();
    }
    
    getArea(){
      return this.width*this.height;
    }
    
    render(){
      super.render();
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  
  class Circle extends Figure {
    constructor(x,y,r) {
      super(x,y);
      this.radius = r;
    }

    increase(times){
      let oldr = this.radius;
      this.radius*=times;
      this.x-=(this.radius-oldr)/4;
      this.y-=(this.radius-oldr)/4;
      this.render();
    }
    
    decrease(times){
      let oldr = this.radius;
      this.radius/=times;
      this.x+=(oldr-this.radius)/4;
      this.y+=(oldr-this.radius)/4;
      this.render();
    }
    
    getArea(){
      return Math.PI*this.radius*this.radius;
    }
    
    render(){
      super.render();
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,true);
      ctx.fill();
    }
  }

  if (!Object.create) {
    Object.create = function (o) {
      if (arguments.length > 1) {
        throw new Error("Object.create implementation only accepts the first parameter.");
      }
      function F() {}
      F.prototype = o;
      return new F();
    };
  }

  var Figures = {
    createSquare: function(x,y,w) {
      return new Square(x,y,w);
    },
    createRectangle: function(x,y,w,h) {
      return new Rectangle(x,y,w,h);
    },
    createCircle: function(x,y,r) {
      return new Circle(x,y,r);
    },
  };

  var fromPrototype = function(prototype, object) {
    var newObject = Object.create(prototype);
    for (var prop in object) {
      if (object.hasOwnProperty(prop)) {
        newObject[prop] = object[prop];
      }
    }
    return newObject;
  };

  Figures.createBlueFigures = function() {
    color="blue";
    return fromPrototype(Figures, {
      createSquare: function(x,y,w) {
        return new Square(x,y,w);
      },
      createRectangle: function(x,y,w,h) {
        return new Rectangle(x,y,w,h);
      },
      createCircle: function(x,y,r) {
        return new Circle(x,y,r);
      },
    });
  };

  let FiguresFactory = Figures.createBlueFigures();
  let figure;
  $("#CreateForm").hide();
  
  $("#CreateFigure").on("click", function() {
    ShowForm();
  });
  
  $("#IncreaseFigure").on("click", function() {
    ShowTimesForm(0);
  });
  
  $("#DecreaseFigure").on("click", function() {
    ShowTimesForm(1);
  });
  
  $("#GetAreaFigure").on("click", function() {
    ShowWindow(figure.getArea());
  });

  function ShowForm(){
    $("#Container").html(Tmpl());
    ShowParams();
    $("#FigureSelect").on("change",function () {
      ShowParams();
    });
  }
  
  function ShowParams(){
    $("#FigureParams").html(TmplParams({typ:$("#FigureSelect").val(),}));
    $("#FigureBtn").on("click", function() {
      let typ = $("#FigureSelect").val();
    
      let x = $("#FigureX").val();
      let y = $("#FigureY").val();
      let w = $("#FigureW").val();
      let h = $("#FigureH").val();
      let r = $("#FigureR").val();
    
      if(typ=="Sqr") figure = FiguresFactory.createSquare(x,y,w);
      if(typ=="Rec") figure = FiguresFactory.createRectangle(x,y,w,h);
      if(typ=="Cir") figure = FiguresFactory.createCircle(x,y,r);
      figure.render();
    
      ClearContainer();
    });
  }
  
  function ShowTimesForm(a){
    $("#Container").html(timesTmpl({text:a==0?"Увеличить":"Уменьшить",}));
    $("#TimesBtn").on("click", function() {
      let times = $("#TimesVal").val();
      if(a==0)
        figure.increase(times);
      else
        figure.decrease(times);
      ClearContainer();
    });
  }
  
  function ShowWindow(a){
    $("#Container").html(window({cont:"Площадь: "+a,}));
    $("#WindowBtn").on("click", function() {
      ClearContainer();
    });
  }
  
  function ClearContainer(){
    $("#Container").html("");
  }
