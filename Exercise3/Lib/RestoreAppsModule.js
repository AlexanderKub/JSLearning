require("./Framework");

//Добавление новой заявки
module.exports=function(){
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
  
    var textvar=data.name.trim();
    textvar=textvar.replace(/<.*?/g,"");
    if(textvar!=data.name.trim()){
      AlertMsg(naf,"Скобки <> запрещенны!");
      return;
    }
    if(!textvar.length){
      AlertMsg(naf,"Пустое значение названия.");
      return;
    }
  
    textvar=data.discription.trim();
    textvar=textvar.replace(/<.*?/g,"");
    if(textvar!=data.discription.trim()){
      AlertMsg(naf,"Скобки <> запрещенны!");
      return;
    }
  
    if(!textvar.length){
      AlertMsg(naf,"Пустое значение описания.");
      return;
    }
    
    if(!UserExist(data.client)){
      AlertMsg(naf,"Недопустимые данные: "+data.client);
      return;
    }
    
    if(data.priority<0 || data.priority>2){
      AlertMsg(naf,"Недопустимые данные: "+data.priority);
      return;
    }
    
    SaveApp(data).then(function () {
      AlertMsg(naf,"<span style='color: green'>Заявка создана!</span>");
      getContent("#Apps",true);
    });
  });
  
  var fs = $("#FindString");
  fs.change(function() {
    Find(fs.val().trim());
  });
};

function ShowCreateFrame(){
  $("#MB1").css("backgroundColor","#d9dee2");
  $("#MB2").css("backgroundColor","");
  
  var naf = $("#NewAppForm");
  
  naf.trigger("reset");
  
  naf.find("#appdate").val(LocalDateTime());
  naf.find("#appestdate").val(LocalDateTime(30));
  naf.find("#appdeaddate").val(LocalDateTime(30));
  naf.find("#status").val(0);
  if(config.UserInfo.role==2){
    naf.find("#ClientSelect").html("<option value='" +
      config.UserInfo.login.toLowerCase()+"' selected>"+
      config.UserInfo.name+"</option>");
    
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
  
  if(config.UserInfo.role>0)return;
  
  var result;
  var Tpl1 = require("../Templates/Selector.ejs");
  GetUsersList([,,2]).then(function(response) {
    result = Tpl1({empty:null,list:response});
    $("#ClientSelect").html(result);
  
    Tpl1 = require("../Templates/Selector.ejs");
    GetUsersList([,1]).then(function(response) {
      result = Tpl1({empty:"-пусто-",list:response});
      $("#ExecutorSelect").html(result);
    });
  });

}

function ShowDetailAppsFrame(){
  $("#MB1").css("backgroundColor","#d9dee2");
  $("#MB2").css("backgroundColor","");
  $("#CommArea").val("");
  if($("#DeleteAppsBtn")!=null)$("#DeleteAppsBtn").remove();
  if($("#EditAppsBtn")!=null)$("#EditAppsBtn").remove();
  if(config.UserInfo.role==2)return;
  
  var elementbtn=document.createElement("button");
  elementbtn.id="EditAppsBtn";
  elementbtn.className ="btn";
  elementbtn.style="float:right;";
  elementbtn.innerHTML="Изменить";
  $("#DetailFrameLabel").append(elementbtn);
  $("#EditAppsBtn").on( "click",function(){
    EditAppsFromDetail();
  });
  if(config.UserInfo.role==1)return;
  
  elementbtn=document.createElement("button");
  elementbtn.id="DeleteAppsBtn";
  elementbtn.className ="btn";
  elementbtn.style="float:right;";
  elementbtn.innerHTML="Удалить";
  $("#DetailFrameLabel").append(elementbtn);
  $("#DeleteAppsBtn").on( "click",function(){
    DeleteAppsFromDetail();
  });
}

function ShowAppsFrame(){
  $("#MB1").css("backgroundColor","#d9dee2");
  $("#MB2").css("backgroundColor","");

  var filter=[];
  if(config.UserInfo.role==1) filter["executor"]=config.UserInfo.login;
  if(config.UserInfo.role==2) filter["client"]=config.UserInfo.login;
  GetAppList(filter).then(function (response) {
    var AppsList=response;
    AppListForSort=AppsList;
    if($("#AppsList")!=null)$("#AppsList").parent().remove();
    $("#AppsFrame").append(GetAppsListItem(AppsList,config.UserInfo));
    $("#AddAppsBtn").css("display",(config.UserInfo.role==1?"none":"inline-block"));
    if(config.UserInfo.role==2)
      $("#FilterClientSelect").remove();
    else{
      var Tpl1 = require("../Templates/Selector.ejs");
      GetUsersList([,,2]).then(function(response) {
        var result = Tpl1({empty:"Все",list:response});
        $("#FilterClientSelect").html(result);
        $("#FilterClientSelect").on("change",function(){
          Filter($("#FilterClientSelect").val());
        });
      });
    }
  });
}

//Детальная информация о заявке
function GetDetailInfo(id){
  ShowDetailAppsFrame();
  
  AppExist(id).then(function (response) {
    var flag = (response.length>0);
    GetApp(id).then(function (response) {
      var Record=flag?response[0]:false;
      if(Record)config.TempAppID=id; else return;
      if($("#AppsDetail")!=null)$("#AppsDetail").remove();
      var Tpl1 = require("../Templates/AppDetail.ejs");
      GetUsersList([,1]).then(function(response) {
        var result = Tpl1({inRec:Record,inList:response,inInfo:config.UserInfo});
        $("#DetailFrameTable").append(result);
      });
    
      var str="";
      GetCommList(id).then(function(response){
        config.CommsList=response;
        Tpl1 = require("../Templates/Comment.ejs");
        for (var x in config.CommsList) {
          var result = Tpl1({UF:config.UserInfo,com:config.CommsList[x]});
          str+=result;
        }
        $("#DetailFrameComments").html(str);
      });
    });
  });
}

//Изменить заявку
function EditAppsFromDetail(){
  GetApp(config.TempAppID).then(function (response) {
    var Record=response[0];
    var data={
      id:Record.id,
      name:Record.Name,
      date:Record.Date,
      client:Record.Client,
      executor:(config.UserInfo.role==0?$("#editappexecut").val().trim():Record.Executor),
      discription:Record.Discription,
      priority:Record.Priority,
      estimated:$("#editappestimated").val().trim(),
      deadline:(config.UserInfo.role==0?$("#editappdeadline").val().trim():Record.Deadline),
      progress:$("#editappstatus").val().trim()
    };
  
    if(data.priority<0 || data.priority>2){
      AlertMsg($("#DetailAppsFrameMsg"),"Недопустимые данные: "+data.priority);
      return;
    }
  
    if(data.progress<0 || data.progress>100){
      AlertMsg($("#DetailAppsFrameMsg"),"Недопустимые данные: "+data.progress);
      return;
    }
  
    SaveApp(data).then(function () {
      AlertMsg($("#DetailAppsFrameMsg"),"<span style='color: green'>Заявка изменена!</span>");
    });
  });
}

//Удалить заявку
function DeleteAppsFromDetail(){
  AppExist(config.TempAppID).then(function (response) {
    var flag = (response.length>0);
    GetApp(config.TempAppID).then(function (response) {
      if(!confirm("Действительно удалить запись о заявке "+
          (flag?response[0].Name:"")+"?"))return;
      DeleteApp(config.TempAppID).then(function () {
        getContent("#Apps",true);
      });
    });
  });
}

//Добавить комментарий
function AddComment(){
  if($("#CommArea").val().trim()!=""){
  
    var textvar=$("#CommArea").val().trim();
    textvar=textvar.replace(/<.*?/g,"");
  
    if(textvar!=$("#CommArea").val().trim()){
      alert("Скобки <> запрещенны!");
      return;
    }
  
    var data={
      app: config.TempAppID,
      user: config.UserInfo.login,
      date: LocalDateTime(),
      text: textvar
    };
    SaveComm(data).then(function(response){
      var newcomm = response;
      $("#CommArea").val("");
  
      var Tpl1 = require("../Templates/Comment.ejs");
      var result = Tpl1({UF:config.UserInfo,com:newcomm});
      $("#DetailFrameComments").append(result);
    });
  }
}

//Удалить комментарий
function DeleteComment(id){
  DeleteComm(id).then(function(){
    $("#CM"+id).remove();
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
      if(!UserExist(o.Client)) return "";
      return GetUser(o.Client).name;
    case 4:
      if(!UserExist(o.Executor)) return "";
      return GetUser(o.Executor).name;
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
  
  if($("#AppsList")!=null)$("#AppsList").parent().remove();
  $("#AppsFrame").append(GetAppsListItem(AppListForSort,config.UserInfo));
}

function Find(str){
  var filter=[];
  if(config.UserInfo.role==1) filter["executor"]=config.UserInfo.login;
  if(config.UserInfo.role==2) filter["client"]=config.UserInfo.login;
  
  GetAppList(filter).then(function (response) {
    var AppsList=response;
  
    AppListBeforeFilter=AppsList;
    AppListBeforeFilter=_.filter(AppListBeforeFilter, _.conforms({ "Name": function(n) {
      return n.toLowerCase().indexOf(str.toLowerCase())>=0;}
    }));
    Filter($("#FilterClientSelect").val());
  });
}

function Filter(filt){
  var filter = [];
  if (config.UserInfo.role == 1) filter["executor"] = config.UserInfo.login;
  if (config.UserInfo.role == 2) filter["client"] = config.UserInfo.login;
  GetAppList(filter).then(function (response) {
    var AppsList = response;
    if($("#FindString").val().trim()=="") {
      if (AppListBeforeFilter) {
        AppListForSort = AppListBeforeFilter;
      } else {
        AppListBeforeFilter = AppsList;
      }
    }
    if(filt!="null")
      AppListForSort=_.filter(AppListBeforeFilter, _.conforms({ "Client": function(n) {
        return n.toLowerCase()==filt.toLowerCase();}
      }));
    else AppListForSort = AppListBeforeFilter;
    if($("#AppsList")!=null)$("#AppsList").parent().remove();
    $("#AppsFrame").append(GetAppsListItem(AppListForSort,config.UserInfo));
  });
}

module.exports.Sort=Sort;
module.exports.AddComment=AddComment;
module.exports.DeleteComment=DeleteComment;
module.exports.DeleteAppsFromDetail=DeleteAppsFromDetail;
module.exports.EditAppsFromDetail=EditAppsFromDetail;
module.exports.GetDetailInfo=GetDetailInfo;
module.exports.ShowDetailAppsFrame=ShowDetailAppsFrame;
module.exports.ShowCreateFrame=ShowCreateFrame;
module.exports.ShowAppsFrame=ShowAppsFrame;