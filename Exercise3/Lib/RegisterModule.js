var $ = require("jquery");
var UserConfig = require("./modules/UserConfig");
var UsersData = require("./modules/UsersData");
var Validation = require("./modules/Validation");
var Alerts = require("./modules/Alerts");

var Tpl = require("../Templates/Registration.ejs");

module.exports=function(){
  var page = $("#page");
  page.append(Tpl);
  $("#RegistrationForm").on("submit", function(event) {
    event.preventDefault();
    var rf = $("#RegistrationForm");
    UsersData.StorageIsClear().then(function (response) {
      var data={
        login: rf.find("#username").val().trim(),
        pass: rf.find("#password").val().trim(),
        name: rf.find("#name").val().trim(),
        role: (response?0:2)
      };

      if(!Validation.Check("login",data.login)){
        Alerts(rf,Validation.WrongValueMessage("login"));
        return;
      }

      if(!Validation.Check("pass",data.pass)){
        Alerts(rf,Validation.WrongValueMessage("pass"));
        return;
      }

      if(!Validation.Check("name",data.name)){
        Alerts(rf,Validation.WrongValueMessage("name"));
        return;
      }

      UsersData.GetUser(data.login).then(function(response) {
        if (response!=0) {
          Alerts(rf, "Логин занят!");
        } else {
          UsersData.SaveUser(data).then(function(){
            getContent("#Login?status=ok", true);
          });
        }
      });
    });
  });
};