var $ = require("jquery");
var Dates = require("./modules/Dates");
var UserConfig = require("./modules/UserConfig");
var UsersData = require("./modules/UsersData");
var AppsData = require("./modules/AppsData");
var CommentsData = require("./modules/CommentsData");
var Alerts = require("./modules/Alerts");

var Tpl = require("../Templates/MainWindow.ejs");
var TplAW = require("../Templates/AppsWindow.ejs");

module.exports = function(){
  var page = $("#page");
  page.append(Tpl);
  var mainWind = $("#MainWindow");
  mainWind.append(TplAW);

  $("#AppsFrame").css("display","block");
  $("#CreateAppsFrame").css("display","none");
  $("#DetailAppsFrame").css("display","none");

  var info = UserConfig.UserInfo();
  $("#StatusBar").html(info.name+"("+info.login+")");
  var naf = $("#NewAppForm");
  naf.on("submit", function(event) {
    event.preventDefault();
    var data={
      name:naf.find("#appname").val().trim(),
      date:naf.find("#appdate").val().trim(),
      client:naf.find("#ClientSelect").val().trim(),
      executor:naf.find("#ExecutorSelect").val().trim(),
      discription:naf.find("#appdisc").val().trim(),
      priority:naf.find("#appprior").val().trim(),
      estimated:naf.find("#appestdate").val().trim(),
      deadline:naf.find("#appdeaddate").val().trim(),
      progress:naf.find("#status").val().trim()
    };
  
    var textvar = data.name.trim();
    textvar = textvar.replace(/<.*?/g,"");
    if(textvar!=data.name.trim()){
      Alerts($("#NewAppForm"),"Скобки <> запрещенны!");
      return;
    }
    if(!textvar.length){
      Alerts($("#NewAppForm"),"Пустое значение названия.");
      return;
    }
  
    textvar=data.discription.trim();
    textvar=textvar.replace(/<.*?/g,"");
    if(textvar!=data.discription.trim()){
      Alerts($("#NewAppForm"),"Скобки <> запрещенны!");
      return;
    }
  
    if(!textvar.length){
      Alerts($("#NewAppForm"),"Пустое значение описания.");
      return;
    }
    UsersData.GetUser(data.client).then(function (response) {
      if(response==0){
        Alerts($("#NewAppForm"),"Недопустимые данные: "+data.client);
        return;
      }

      if(data.priority<0 || data.priority>2){
        Alerts($("#NewAppForm"),"Недопустимые данные: "+data.priority);
        return;
      }

      AppsData.SaveApp(data).then(function () {
        Alerts($("#NewAppForm"),"<span class='greenCL'>Заявка создана!</span>");
        getContent("#Apps",true);
      });
    });
  });

  $("#CommArea").on("keyup",function(event){TextAreaResize(event, 15, 2)});
  $("#SendComm").on("click",function(){AddComment()});
  $("#BackAppsBtn").on("click",function(){getContent("#Apps", true)});
  $("#BackBtn").on("click",function(){getContent("#Apps", true)});
  $("#AddAppsBtn").on("click",function(){getContent("#CreateApp", true)});

  var fs = $("#FindString");
  fs.change(function() {
    Find($("#FindString").val().trim());
  });
};

function ShowCreateFrame(){
  $("#MB1").css("backgroundColor","#d9dee2");
  $("#MB2").css("backgroundColor","");

  $("#CreateAppsFrame").css("display","block");
  $("#DetailAppsFrame").css("display","none");
  $("#AppsFrame").css("display","none");

  var naf = $("#NewAppForm");
  
  naf.trigger("reset");
  
  naf.find("#appdate").val(Dates.LocalDateTime());
  naf.find("#appestdate").val(Dates.LocalDateTime(30));
  naf.find("#appdeaddate").val(Dates.LocalDateTime(30));
  naf.find("#status").val(0);
  var info = UserConfig.UserInfo();
  if(info.role==2){
    naf.find("#ClientSelect").html("<option value='" +
      info.login.toLowerCase()+"' selected>"+
      info.name+"</option>");
    
    var cs = $("#ClientSelect");
    cs.prop("disabled",true);
    $("#appdate").prop("disabled",true);
    $("#ExecutorSelect").prop("disabled",true);
    naf.find("#appestdate").prop("disabled",true);
    naf.find("#status").prop("disabled",true);
    
    cs.prop("hidden",true);
    $("#NewAppFormDTRow").prop("hidden",true);
    $("#NewAppFormCERow").prop("hidden",true);
    $("#NewAppFormDSRow").prop("hidden",true);
  }
  
  if(info.role>0)return;
  
  var result;
  var Tpl1 = require("../Templates/Selector.ejs");
  UsersData.GetUsersList([0,0,1]).then(function(response) {
    result = Tpl1({empty:null,list:response});
    $("#ClientSelect").html(result);
  
    Tpl1 = require("../Templates/Selector.ejs");
    UsersData.GetUsersList([0,1,0]).then(function(response) {
      result = Tpl1({empty:"-пусто-",list:response});
      $("#ExecutorSelect").html(result);
    });
  });
}

var dab = $("#DeleteAppsBtn");
var eab = $("#EditAppsBtn");
function ShowDetailAppsFrame(){
  $("#MB1").css("backgroundColor","#d9dee2");
  $("#MB2").css("backgroundColor","");

  $("#DetailAppsFrame").css("display","block");
  $("#CreateAppsFrame").css("display","none");
  $("#AppsFrame").css("display","none");

  $("#CommArea").val("");
  var dfl = $("#DetailFrameLabel");

  if(dab!=null)$("#DeleteAppsBtn").remove();
  if(eab!=null)$("#EditAppsBtn").remove();

  var info = UserConfig.UserInfo();
  if(info.role==2)return;
  
  var elementbtn=document.createElement("button");
  elementbtn.id="EditAppsBtn";
  elementbtn.className ="btn";
  elementbtn.style="float:right;";
  elementbtn.innerHTML="Изменить";
  $(elementbtn).on( "click",function(){
    EditAppsFromDetail();
  });
  dfl.append(elementbtn);
  if(info.role==1)return;
  
  elementbtn=document.createElement("button");
  elementbtn.id="DeleteAppsBtn";
  elementbtn.className ="btn";
  elementbtn.style="float:right;";
  elementbtn.innerHTML="Удалить";
  $(elementbtn).on( "click",function(){
    DeleteAppsFromDetail();
  });
  dfl.append(elementbtn);
}

function ShowAppsFrame(){
  $("#MB1").css("backgroundColor","#d9dee2");
  $("#MB2").css("backgroundColor","");

  $("#AppsFrame").css("display","block");
  $("#CreateAppsFrame").css("display","none");
  $("#DetailAppsFrame").css("display","none");

  var filter=[];
  var info = UserConfig.UserInfo();
  if(info.role==1) filter["executor"]=info.login;
  if(info.role==2) filter["client"]=info.login;
  AppsData.GetAppList(filter).then(function (response) {
    var AppsList=response;
    var al = $("#AppsList");
    AppListForSort=AppsList;
    if(al!=null)al.parent().remove();
    $("#AppsFrame").append(GetAppsListItem(AppsList,info));
    $("#AddAppsBtn").css("display",(info.role==1?"none":"inline-block"));
    if(info.role==2)
      $("#FilterClientSelect").remove();
    else{
      var Tpl1 = require("../Templates/Selector.ejs");
      UsersData.GetUsersList([0,0,1]).then(function(response) {
        var result = Tpl1({empty:"Все",list:response});
        var fcs = $("#FilterClientSelect");
        fcs.html(result);
        fcs.on("change",function(){
          Filter($("#FilterClientSelect").val());
        });
      });
    }
  });
}

function GetDetailInfo(id){
  ShowDetailAppsFrame();
  AppsData.GetApp(id).then(function (response) {
    var flag = (response!=0);
    var Record = flag?response:false;
    if(Record)UserConfig.TempAppID(id); else{location.hash="Apps"; return;}
    var ad = $("#AppsDetail");
    if(ad!=null)ad.remove();
    var Tpl1 = require("../Templates/AppDetail.ejs");
    UsersData.GetUsersList([0,1,0]).then(function(response) {
      var result = Tpl1({inRec:Record,inList:response,inInfo:UserConfig.UserInfo()});
      $("#DetailFrameTable").append(result);
    });

    $("#DetailFrameComments").html("");
    CommentsData.GetCommList(id).then(function(response){
      UserConfig.CommsList(response);
      Tpl1 = require("../Templates/Comment.ejs");
      var list = UserConfig.CommsList();
      for (var x in list) {
        var result = Tpl1({UF:UserConfig.UserInfo(),com:list[x]});
        $("#DetailFrameComments").append(result);
        $("#CMDelBtn"+list[x].id).on("click",list[x].id,function(event){
          DeleteComment(event.data);
        });
      }
    });
  });
}

function EditAppsFromDetail(){
  AppsData.GetApp(UserConfig.TempAppID()).then(function (response) {
    var Record=response;
    var data={
      id:Record.id,
      name:Record.Name,
      date:Record.Date,
      client:Record.Client,
      executor:(UserConfig.UserInfo().role==0?$("#editappexecut").val().trim():Record.Executor),
      discription:Record.Discription,
      priority:Record.Priority,
      estimated:$("#editappestimated").val().trim(),
      deadline:(UserConfig.UserInfo().role==0?$("#editappdeadline").val().trim():Record.Deadline),
      progress:$("#editappstatus").val().trim()
    };
  
    if(data.priority<0 || data.priority>2){
      Alerts($("#DetailAppsFrameMsg"),"Недопустимые данные: "+data.priority);
      return;
    }
  
    if(data.progress<0 || data.progress>100){
      Alerts($("#DetailAppsFrameMsg"),"Недопустимые данные: "+data.progress);
      return;
    }

    AppsData.SaveApp(data).then(function () {
      Alerts($("#DetailAppsFrameMsg"),"<span class='greenCL'>Заявка изменена!</span>");
    });
  });
}

function DeleteAppsFromDetail(){
  var item = UserConfig.TempAppID();
  AppsData.GetApp(item).then(function (response) {
    var flag = (response!=0);
    if(!confirm("Действительно удалить запись о заявке "+
        (flag?response.Name:"")+"?"))return;
    AppsData.DeleteApp(item).then(function (response) {
      console.log(response);
      if(response)getContent("#Apps",true);
    });
  });
}

function AddComment(){
  var ca = $("#CommArea");
  if(ca.val().trim()!=""){
  
    var textvar=ca.val().trim();
    textvar=textvar.replace(/<.*?/g,"");
  
    if(textvar!=ca.val().trim()){
      alert("Скобки <> запрещенны!");
      return;
    }
  
    var data={
      app: UserConfig.TempAppID(),
      user: UserConfig.UserInfo().login,
      date: Dates.LocalDateTime(),
      text: textvar
    };

    CommentsData.SaveComm(data).then(function(response){
      var newcomm = response;
      $("#CommArea").val("");
  
      var Tpl1 = require("../Templates/Comment.ejs");
      var result = Tpl1({UF:UserConfig.UserInfo(),com:newcomm});
      $("#DetailFrameComments").append(result);
      $("#CMDelBtn"+newcomm.id).on("click",newcomm.id,function(event){
        DeleteComment(event.data);
      });
    });
  }
}

function DeleteComment(id){
  CommentsData.DeleteComm(id).then(function(response){
    if(response)$("#CM"+id).remove();
  });
}

var AppListForSort;
var AppListBeforeFilter;
var LastClick = 0;
function Sort(i){

  AppListForSort=_.sortBy(AppListForSort, function(o) { 
    switch (i) {
    case 1:
      return o.Name;
    case 2:
      return o.Date;
    case 3:
      return o.Client;
    case 4:
      return o.Executor;
    case 5:
      return o.Priority;
    case 6:
      return o.Estimated;
    case 7:
      return o.Deadline;
    case 8:
      return parseInt(o.Progress);
    default:
      return o.ID;
    }
  });

  if(LastClick==i){
    AppListForSort=AppListForSort.reverse();
    LastClick=0;
  }else LastClick=i;
  var al = $("#AppsList");
  if(al!=null)al.parent().remove();
  $("#AppsFrame").append(GetAppsListItem(AppListForSort,UserConfig.UserInfo()));
}

function Find(str){
  var filter=[];
  var info = UserConfig.UserInfo();
  if(info.role==1) filter["executor"]=info.login;
  if(info.role==2) filter["client"]=info.login;
  
  AppsData.GetAppList(filter).then(function (response) {
    AppListBeforeFilter=response;
    AppListBeforeFilter=_.filter(AppListBeforeFilter, _.conforms({ "Name": function(n) {
      return n.toLowerCase().indexOf(str.toLowerCase())>=0;}
    }));
    Filter((info.role==2)?info.login:$("#FilterClientSelect").val());
  });
}

function Filter(filt){
  var filter = [];
  var info = UserConfig.UserInfo();
  if (info.role == 1) filter["executor"] = info.login;
  if (info.role == 2) filter["client"] = info.login;
  AppsData.GetAppList(filter).then(function (response) {
    if($("#FindString").val().trim()=="") {
      if (AppListBeforeFilter) {
        AppListForSort = AppListBeforeFilter;
      } else {
        AppListBeforeFilter = response;
      }
    }
    if(filt!="null")
      AppListForSort=_.filter(AppListBeforeFilter, _.conforms({ "Client": function(n) {
        return n.toLowerCase()==filt.toLowerCase();}
      }));
    else AppListForSort = AppListBeforeFilter;
    var al = $("#AppsList");
    if(al!=null)al.parent().remove();
    $("#AppsFrame").append(GetAppsListItem(AppListForSort,UserConfig.UserInfo()));
  });
}

function GetAppsListItem(list,UserInfo){
  var element=document.createElement("div");
  var Tpl1 = require("../Templates/AppList.ejs");
  element.innerHTML = Tpl1({inInfo:UserInfo,inList:list});
  for(var i = 1;i<9;i++) {
    $(element).find(".simple-little-table tr:first-child th:nth-child(" + i + ")").on("click",i,function (event) {
      Sort(event.data);
    });
  }
  return element;
}

function TextAreaResize(event, LineHeight, MinLineCount) {
  var MinLineHeight = MinLineCount * LineHeight;
  var obj = event.target;
  var div = document.getElementById(obj.id + "Div");
  div.innerHTML = obj.value;
  var ObjHeight = div.offsetHeight;
  if (event.keyCode == 13)
    ObjHeight += LineHeight;
  else if (ObjHeight < MinLineHeight)
    ObjHeight = MinLineHeight;
  obj.style.height = ObjHeight + "px";
}

module.exports.GetDetailInfo=GetDetailInfo;
module.exports.ShowDetailAppsFrame=ShowDetailAppsFrame;
module.exports.ShowCreateFrame=ShowCreateFrame;
module.exports.ShowAppsFrame=ShowAppsFrame;