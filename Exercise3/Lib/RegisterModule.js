require("./Framework");
var LogonModule = require("./LoginModule");
//Регистрация
module.exports=function(){
  $("#RegistrationForm").on("submit", function(event) {
    event.preventDefault();
    var rf = $("#RegistrationForm");
    var data={
      login: rf.find("#username").val().trim(),
      pass: rf.find("#password").val().trim(),
      name: rf.find("#name").val().trim(),
      role: (StorageIsClear()?0:2)
    };
    
    if(!ValidateValue("login",data.login)){
      AlertMsg(rf,WrongValueMessage("login"));
      return;
    }
    
    if(!ValidateValue("pass",data.pass)){
      AlertMsg(rf,WrongValueMessage("pass"));
      return;
    }
    
    if(!ValidateValue("name",data.name)){
      AlertMsg(rf,WrongValueMessage("name"));
      return;
    }
    
    UserExist(data.login).then(function(response) {
      if (response.length > 0) {
        AlertMsg(rf, "Логин занят!");
      } else {
        SaveUser(data);
        getContent("#Login", true);
        LogonModule.Show();
        AlertMsg($("#LoginForm"), "<span style='color:green'>Успешная регистрация!</span>");
      }
    });
  });
};

module.exports.Show=function() {
  var rf = $("#RegistrationForm");
  rf.trigger("reset");
  AlertMsg(rf, "");
};