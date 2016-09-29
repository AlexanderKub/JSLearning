require("../CSS/style.css");
var $ = require("jquery");
var UserConfig = require("./modules/UserConfig");
var UsersData = require("./modules/UsersData");
var LoginModule = require("./LoginModule");
var RegisterModule = require("./RegisterModule");
var UsersPanelModule = require("./UsersPanelModule");
var AppsModule = require("./RestoreAppsModule");
var Alerts = require("./modules/Alerts");
var passwordHash = require("password-hash");

$("document").ready(function(){
  getContent(window.location.hash, true);
});

window.addEventListener("popstate", function(e) {
  getContent(location.hash, false);
});

function getContent(url, addEntry) {
  if(addEntry) history.pushState(null, null, url);
  console.log(url);
  var page = $("#page");
  page.html("");

  if(url=="#Logout"){
    sessionStorage.clear();
    getContent("#Login", true);
    return;
  }

  if(url=="" || url=="#" || url=="#Login" || url.indexOf("#Login")>-1){
    if(url.split("=").length>1){
      LoginModule("ok");
      return;
    }
    LoginModule();
    return;
  }

  if(url=="#Registration"){
    RegisterModule();
    return;
  }
  var info = UserConfig.UserInfo();
  if(info){
    $("#MB2").css("display",(info.role==0?"inline":"none"));

    if(url=="#Users"){
      UsersPanelModule();
      return;
    }

    if(url=="#CreateUser"){
      UsersPanelModule();
      UsersPanelModule.AddNewUserFormShow(true);
      return;
    }

    if(url=="#Apps"){
      AppsModule();
      AppsModule.ShowAppsFrame();
      return;
    }

    Alerts($("#AppsFrameMsg"),"");
    Alerts($("#DetailAppsFrameMsg"),"");

    if(url=="#CreateApp"){
      AppsModule();
      AppsModule.ShowCreateFrame();
      return;
    }

    if(url.indexOf("#AppsDetail")>-1){
      var id = parseInt(url.split("=")[1]);
      AppsModule();
      AppsModule.GetDetailInfo(id);
      return;
    }

    if(url.indexOf("#UsersDetail")>-1){
      var id = url.split("=")[1];
      UsersPanelModule();
      UsersPanelModule.ShowUserInfo(id);
      return;
    }
  } else{
    if (sessionStorage.getItem("User_login") && sessionStorage.getItem("User_pass")) {
      var log = sessionStorage.getItem("User_login");
      var ps = sessionStorage.getItem("User_pass");
      UsersData.GetUser(log).then(function(response) {
        if(response==0) {
          Alerts(lf, "Неверный логин!");
        }else{
          if(response==1) {
              Alerts(lf,"Неверный пароль!");
          }else{
            UserConfig.UserInfo(response);
            UsersData.SaveUser(UserConfig.UserInfo());
            getContent("#Apps", true);
            var info = UserConfig.UserInfo();
            sessionStorage.setItem("User_login", info.login);
            sessionStorage.setItem("User_pass", info.pass);
          }
        }
      });
    }else {
      getContent("#Login", true);
      return;
    }
  }

  var Tpl = require("../Templates/404.ejs");
  page.append(Tpl);
}

global.getContent=getContent;