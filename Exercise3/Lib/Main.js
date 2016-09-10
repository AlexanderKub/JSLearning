//Инициализация
require("./Framework");
var LoginModule = require("./LoginModule");
var RegisterModule = require("./RegisterModule");
var UsersPanelModule = require("./UsersPanelModule");
var AppsModule = require("./RestoreAppsModule");

var Tpl = require("../Templates/Authorization.ejs");
var page = $("#page");
page.append(Tpl);
Tpl = require("../Templates/Registration.ejs");
page.append(Tpl);
Tpl = require("../Templates/MainWindow.ejs");
page.append(Tpl);
var mainWind = $("#MainWindow");
Tpl = require("../Templates/UsersWindow.ejs");
mainWind.append(Tpl);
Tpl = require("../Templates/AppsWindow.ejs");
mainWind.append(Tpl);

Tpl = require("../Templates/404.ejs");
page.append(Tpl);
var NotFound = page.find("#404");

LoginModule();
RegisterModule();
UsersPanelModule();
AppsModule();

$("document").ready(function(){
  getContent(window.location.hash, true);
});

window.addEventListener("popstate", function(e) {
  getContent(location.hash, false);
});

function getContent(url, addEntry) {
  if(addEntry) history.pushState(null, null, url);
  HideWindows();
  HideFrames();
  console.log(url);

  if(url=="" || url=="#" || url=="#Login"){
    $("#LogonWindow").show();
    LoginModule.Show();
    return;
  }
  
  if(url=="#Registration"){
    $("#RegWindow").show();
    RegisterModule.Show();
    return;
  }

  if(config.UserInfo){
    $("#MB2").css("display",(config.UserInfo.role==0?"inline":"none"));
    $("#StatusBar").html(config.UserInfo.name+"("+config.UserInfo.login+")");

    if(url=="#Users"){
      $("#MainWindow").show();
      $("#UsersFrame").show();

      UsersPanelModule.Show();
      return;
    }

    if(url=="#CreateUser"){
      $("#MainWindow").show();
      $("#UsersFrame").show();
      UsersPanelModule.Show().then(function(){
        UsersPanelModule.AddNewUserFormShow(true);
      });
      return;
    }

    if(url=="#Apps"){
      $("#MainWindow").show();
      $("#AppsFrame").show();

      AppsModule.ShowAppsFrame();
      return;
    }

    AlertMsg($("#AppsFrameMsg"),"");
    AlertMsg($("#DetailAppsFrameMsg"),"");

    if(url=="#CreateApp"){
      $("#MainWindow").show();
      $("#CreateAppsFrame").show();

      AppsModule.ShowCreateFrame();
      return;
    }

    if(url.indexOf("#AppsDetail")>-1){
      $("#MainWindow").show();
      $("#DetailAppsFrame").show();
      var id = parseInt(url.split("=")[1]);
      AppsModule.GetDetailInfo(id);
      return;
    }

    if(url.indexOf("#UsersDetail")>-1){
      $("#MainWindow").show();
      $("#UsersFrame").show();
      var id = url.split("=")[1];
      UsersPanelModule.ShowUserInfo(id);
      return;
    }
  }else{
    if (sessionStorage.getItem("User_login") && sessionStorage.getItem("User_pass")) {
      var log = sessionStorage.getItem("User_login");
      var ps = sessionStorage.getItem("User_pass");
      UserExist(log).then(function(response) {
        if(response.length>0){
          CheckPassword(log,ps).then(function(response) {
           if(response.length>0){
             GetUser(log).then(function(response) {
               config.UserInfo=response[0];
                 SaveUser(config.UserInfo);
                 getContent((url=="" || url=="#" || url=="#Login")?"#Apps":url, true);
                 sessionStorage.setItem("User_login", config.UserInfo.login);
                 sessionStorage.setItem("User_pass", config.UserInfo.pass);
                 return;
             });
           }
        });
      }
     });
    }else {
      getContent("#Login", true);
      return;
    }
  }
  NotFound.show();
}

function HideWindows() {
    NotFound.hide();
    var windowsList=document.getElementsByClassName("WindowClass");
    for (var i = 0; i < windowsList.length; i++)
        windowsList[i].style.display="none";
}

function HideFrames(){
    var frameList=document.getElementsByClassName("FrameClass");
    for (var i = 0; i < frameList.length; i++)
        frameList[i].style.display=(frameList[i].id==name?"block":"none");
}
global.getContent=getContent;
module.exports.AppsModule=AppsModule;