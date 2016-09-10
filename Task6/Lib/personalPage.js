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
  
  _this.Init = function () {
    _this.Div.find("#AddList").on("click",function () {
      _this.Div.find("#Container").html(formTmpl({id:(Persons.length>0?parseInt(_.maxBy(Persons,"id").id):0)+1}));
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
          alertMsg.html("Работник с таким ID уже существует.");
          alertMsg.removeClass("hidden");
          setTimeout(function () {
            alertMsg.addClass("hidden");
          }, 100);
        }else{
          let CreationName = _this.Div.find("#Name").val();
          let CreationSum = _this.Div.find("#Sum").val();
          if(CreationType=="Fix"){
            Persons.push(Personals.createFixedPersonal(CreationID,CreationName,CreationSum));
          }else{
            Persons.push(Personals.createRatePersonal(CreationID,CreationName,CreationSum));
          }
          ShowSortList();
          ClearContainer();
        }
      });
      
      _this.Div.find("#CancelBtn").on("click", function() {
        ClearContainer();
      });
    });
    
    _this.Div.find("#ImportList").on("click",function () {
      _this.Div.find("#FileInput").click();
    });
  
    _this.Div.find("#FileInput").on("change",function (){
      loadData();
    });
    
    this.Div.find("#ExportList").prop("disabled",Persons.length==0);
    _this.Div.find("#ExportList").on("click",function () {
      saveData(Persons);
    });
    ShowSortList();
    ClearContainer();
  };
  
  function ShowSortList (){
    _this.Div.find("#ExportList").prop("disabled",Persons.length==0);
    let FirstFiveStr = [];
    let LastThreeIDs = [];
    Persons = _.sortBy(Persons, "sum",function(o) {return (8000-o.name.toLowerCase().charCodeAt(0));}).reverse();
    _this.Div.find("#PersonsList").html(listTmpl({List:Persons}));
    Persons.forEach(function(item, i, arr){
      if(i<5)FirstFiveStr.push(item.name);
      LastThreeIDs.push(arr[i].id);
      if(LastThreeIDs.length>3)LastThreeIDs.shift();
      _this.Div.find("#DelItem"+item.id).hide();
      _this.Div.find("#DelItem"+item.id).on("click",function () {
        _this.Div.find("#ListItem"+item.id).remove();
        _.remove(Persons, function(o) { return o.id==item.id;});
        ShowSortList();
      });
      
      _this.Div.find("#ListItem"+item.id).on("mouseover",function () {
        _this.Div.find("#DelItem"+item.id).show();
      });
      
      _this.Div.find("#ListItem"+item.id).on("mouseout",function () {
        _this.Div.find("#DelItem"+item.id).hide();
      });
  
      _this.Div.find("#ListItem"+item.id+" #tid").on("click",function () {
        let td = _this.Div.find("#ListItem"+item.id+" #tid").parent();
        td.html("<input type='text' id='tidinp"+item.id+"' style='width: 50px;' value='"+item.id+"'>");
        let input =_this.Div.find("#tidinp"+item.id);
  
        input.focus();
        input.setCursorPosition(input.val().length);
        input.on("blur",function () {
          ChangeId(input.val(),item);
        });
        input.on("keyup", function(event){
          if(event.keyCode == 13){
            ChangeId(input.val(),item);
          }
        });
      });
      
      _this.Div.find("#ListItem"+item.id+" #tname").on("click",function () {
        let td = _this.Div.find("#ListItem"+item.id+" #tname").parent();
        td.html("<input type='text' id='tnameinp"+item.id+"' style='width: 300px;' value='"+item.name+"'>");
        let input =_this.Div.find("#tnameinp"+item.id);
  
        input.focus();
        input.setCursorPosition(input.val().length);
        input.on("blur",function () {
          ChangeName(input.val(),item);
        });
        input.on("keyup", function(event){
          if(event.keyCode == 13){
            ChangeName(input.val(),item);
          }
        });
      });
  
      _this.Div.find("#ListItem"+item.id+" #tsum").on("click",function () {
        let td = _this.Div.find("#ListItem"+item.id+" #tsum").parent();
        td.html("<input type='text' id='tsuminp"+item.id+"' style='width: 180px;' value='"+item.sum+"'>");
        let input =_this.Div.find("#tsuminp"+item.id);
  
        input.focus();
        input.setCursorPosition(input.val().length);
        input.on("blur",function () {
          ChangeSum(input.val(),item);
        });
        input.on("keyup", function(event){
          if(event.keyCode == 13){
            ChangeSum(input.val(),item);
          }
        });
      });
    });
    
    if(FirstFiveStr.length>0) {
      _this.Div.find("#Result").html("Имена первых " + FirstFiveStr.length + "-" +
        NumText(FirstFiveStr.length) + ": " + FirstFiveStr.toString() +
        "<br>ID последних " + LastThreeIDs.length + "-" + NumText(LastThreeIDs.length) + ": "
        + LastThreeIDs.toString());
    }else{
      _this.Div.find("#Result").html("");
    }
  }
  
  function ClearContainer(){
    _this.Div.find("#Container").html("");
    _this.Div.find("#Container").hide();
  }
  
  _this.HTML = function () {
    _this.Init();
    return _this.Div;
  };
  
  let saveData = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data) {
      let json = JSON.stringify(data);
      let blob = new Blob([json], {type: "octet/stream"});
      let url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = "Persons"+Date.now()+".json";
      a.click();
      window.URL.revokeObjectURL(url);
    };
  }());
  
  function loadData () {
    let reader = new FileReader();
    reader.onload = function(event) {
      let contents = event.target.result;
      Persons = JSON.parse(contents);
      _this.Div.find("#FileInput").prop("value", null);
      ClearContainer();
      ShowSortList();
      ChangeId(Persons[0].id,Persons[0]);
    };
  
    reader.onerror = function(event) {
      let alertMsg = _this.Div.find("#Alert");
      alertMsg.removeClass("hidden");
      alertMsg.html("Файл не может быть прочитан! код " + event.target.error.code);
      alertMsg.addClass("hidden");
      _this.Div.find("#FileInput").prop("value", null);
    };
  
    let file = _this.Div.find("#FileInput").get(0).files[0];
    reader.readAsText(file);
  }
  
  function NumText(a){
    if (a==1) return "го";
    if (a<5) return "х";
    if (a>4) return "ти";
  }
  
  $.fn.setCursorPosition = function (pos) {
    this.each(function(index, elem) {
      if (elem.setSelectionRange) {
        elem.setSelectionRange(pos, pos);
      } else if (elem.createTextRange) {
        var range = elem.createTextRange();
        range.collapse(true);
        range.moveEnd("character", pos);
        range.moveStart("character", pos);
        range.select();
      }
    });
    return this;
  };
  
  function ChangeId(val,item) {
    val = val.trim();
    val = parseInt(val);
    if(_.find( Persons, _.matchesProperty("id", val))){
      if(val!=item.id){
        let alertMsg = _this.Div.find("#Alert");
        alertMsg.html("Работник с таким ID уже существует.");
        alertMsg.removeClass("hidden");
        setTimeout(function () {
          alertMsg.addClass("hidden");
        }, 100);
      }
    }else{
      item.id = val;
    }
    ShowSortList();
  }
  
  function ChangeSum(val,item) {
    item.sum = parseFloat(val);
    item.rate = item.sum/(20.8*8);
    ShowSortList();
  }
  
  function ChangeName(val,item) {
    item.name = val;
    ShowSortList();
  }
})(typeof exports === "undefined" ? this["personalPage"] = {} : exports);
