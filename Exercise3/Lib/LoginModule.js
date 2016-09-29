var $ = require("jquery");
var UserConfig = require("./modules/UserConfig");
var UsersData = require("./modules/UsersData");
var Validation = require("./modules/Validation");
var Alerts = require("./modules/Alerts");

var Tpl = require("../Templates/Authorization.ejs");

module.exports = function(flag){
  var page = $("#page");
  page.append(Tpl);
  var lf = $("#LoginForm");

  if(flag)
    Alerts(lf, "<span class='greenCl'>Успешная регистрация!</span>");

  lf.on("submit", function(event) {
    event.preventDefault();
    var data={
      login: lf.find("#username").val().trim(),
      pass: lf.find("#password").val().trim()
    };
    if(!Validation.Check("login",data.login)){
      Alerts(lf,Validation.WrongValueMessage("login"));
      return;
    }

    if(!Validation.Check("pass",data.pass)){
      Alerts(lf,Validation.WrongValueMessage("pass"));
      return;
    }
    UsersData.AuthUser(data.login,data.pass).then(function(response) {
      if(response==0) {
        Alerts(lf, "Неверный логин!");
      }else{
        if(response==1) {
          Alerts(lf,"Неверный пароль!");
        }else{
          UserConfig.UserInfo(response);
          UsersData.LoginUser(response.login);
          getContent("#Apps", true);
          sessionStorage.setItem("User_login", UserConfig.UserInfo().login);
          sessionStorage.setItem("User_pass", UserConfig.UserInfo().pass);
        }
      }
    });
  });

  if (!UserConfig.UserInfo() && sessionStorage.getItem("User_login") && sessionStorage.getItem("User_pass")) {
    var log = sessionStorage.getItem("User_login");
    var ps = sessionStorage.getItem("User_pass");
    UsersData.AuthUser(log,ps).then(function(response) {
      if(response==0) {
        Alerts(lf, "Неверный логин!");
      }else{
        if(response==1) {
          Alerts(lf,"Неверный пароль!");
        }else{
          UserConfig.UserInfo(response);
          UsersData.SaveUser(UserConfig.UserInfo());
          getContent("#Apps", true);
          sessionStorage.setItem("User_login", UserConfig.UserInfo().login);
          sessionStorage.setItem("User_pass", UserConfig.UserInfo().pass);
        }
      }
    });
  }
};