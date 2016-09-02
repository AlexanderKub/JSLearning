(function (exports) {
  let _this = exports;
  let $ = require("jquery");
  let _ =require("lodash");
  let Personals = require("./personalFactory.js").Personals;
  let personalPageTemplate = require("../Templates/personalPage.ejs");
  let listTmpl = require("../Templates/personalList.ejs");
  let formTmpl = require("../Templates/personsForm.ejs");
  
  let Persons = [];
  
  _this.Div = $("<div id='personalPage' class='page'></div>");
  _this.Div.html(personalPageTemplate());
  
  Persons.push(Personals.createFixedPersonal(1,"Stan",6000));
  Persons.push(Personals.createFixedPersonal(2,"Hawk",6000));
  Persons.push(Personals.createFixedPersonal(3,"King",6000));
  Persons.push(Personals.createRatePersonal(4,"Captain",300));
  Persons.push(Personals.createRatePersonal(5,"Freddy",50));
  Persons.push(Personals.createRatePersonal(6,"Poet",70));
  
  _this.Init = function () {
    _this.Div.find("#AddList").on("click",function () {
      _this.Div.find("#Container").html(formTmpl());
      _this.Div.find("#Container").show();
      
      _this.Div.find("#TypeSelect").on("change",function () {
        let CreationType = _this.Div.find("#TypeSelect").val();
        _this.Div.find("#txt").html(CreationType=="Fix"?"Зарплата":"Ставка");
      });
      
      _this.Div.find("#AddBtn").on("click",function () {
        let CreationType = _this.Div.find("#TypeSelect").val();
        let CreationID = _this.Div.find("#ID").val();
        if(_.find( Persons, _.matchesProperty("id", CreationID))){
          let alertMsg = _this.Div.find("#Alert");
          alertMsg.removeClass("hidden");
          alertMsg.html("Работник с таким ID уже существует.");
          alertMsg.addClass("hidden");
          return;
        }
        let CreationName = _this.Div.find("#Name").val();
        let CreationSum = _this.Div.find("#Sum").val();
        if(CreationType=="Fix"){
          Persons.push(Personals.createFixedPersonal(CreationID,CreationName,CreationSum));
        }else{
          Persons.push(Personals.createRatePersonal(CreationID,CreationName,CreationSum));
        }
        ShowSortList();
        ClearContainer();
      });
      
      _this.Div.find("#CancelBtn").on("click", function() {
        ClearContainer();
      });
    });
    
    _this.Div.find("#ImportList").on("click",function () {
      console.log("ImportList");
    });
  
    this.Div.find("#ExportList").prop("disabled",Persons.length==0);
    _this.Div.find("#ExportList").on("click",function () {
      console.log("ExportList");
    });
    ShowSortList();
    ClearContainer();
  };
  
  function ShowSortList (){
    let FirstFiveStr = [];
    let LastThreeIDs = [];
    Persons=_.sortBy(Persons, "sum",function(o) {return (8000-o.Name.charCodeAt(0));}).reverse();
    _this.Div.find("#PersonsList").html(listTmpl({List:Persons,}));
    Persons.forEach(function(item, i,arr){
      if(i<5)FirstFiveStr.push(item.Name);
      if(i>1) {
        LastThreeIDs[0] = arr[i-2].ID;
        LastThreeIDs[1] = arr[i-1].ID;
        LastThreeIDs[2] = arr[i].ID;
      }
      _this.Div.find("#ListItem"+i).on("click",function () {
        console.log(item);
      });
    });
    _this.Div.find("#Result").html("Имена первых 5-ти: " + FirstFiveStr.toString() +
      "<br>ID последних 3-х: " + LastThreeIDs.toString());
  }
  
  function ClearContainer(){
    _this.Div.find("#Container").html("");
    _this.Div.find("#Container").hide();
  }
  
  _this.HTML = function () {
    _this.Init();
    return _this.Div;
  };
  
})(typeof exports === "undefined" ? this["personalPage"] = {} : exports);
