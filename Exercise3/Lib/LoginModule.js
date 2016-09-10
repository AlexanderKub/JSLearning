require("./Framework");
//Авторизация
module.exports=function(){
  var lf = $("#LoginForm");
  if (!config.UserInfo && sessionStorage.getItem("User_login") && sessionStorage.getItem("User_pass")) {
    var log = sessionStorage.getItem("User_login");
    var ps = sessionStorage.getItem("User_pass");
    UserExist(log).then(function(response) {
      if(response.length==0)
        AlertMsg(lf,"Пользователь не существует!");
      else{
        CheckPassword(log,ps).then(function(response) {
          if(response.length==0)
            AlertMsg(lf,"Неверный пароль!");
          else{
            GetUser(log).then(function(response) {
              config.UserInfo=response[0];
              SaveUser(config.UserInfo);
              getContent("#Apps", true);
              sessionStorage.setItem("User_login", config.UserInfo.login);
              sessionStorage.setItem("User_pass", config.UserInfo.pass);
            });
          }
        });
      }
    });
  }
  
  lf.on("submit", function(event) {
    event.preventDefault();
    var data={
      login: lf.find("#username").val().trim(),
      pass: lf.find("#password").val().trim()
    };
    if(!ValidateValue("login",data.login)){
      AlertMsg(lf,WrongValueMessage("login"));
      return;
    }
    
    if(!ValidateValue("pass",data.pass)){
      AlertMsg(lf,WrongValueMessage("pass"));
      return;
    }
    
    UserExist(data.login).then(function(response) {
      if(response.length==0)
        AlertMsg(lf,"Пользователь не существует!");
      else{
        CheckPassword(data.login,data.pass).then(function(response) {
          if(response.length==0)
            AlertMsg(lf,"Неверный пароль!");
          else{
            GetUser(data.login).then(function(response) {
              config.UserInfo=response[0];
              SaveUser(config.UserInfo);
              getContent("#Apps", true);
              sessionStorage.setItem("User_login", config.UserInfo.login);
              sessionStorage.setItem("User_pass", config.UserInfo.pass);
            });
          }
        });
      }
    });
  });
  
  Show();
};

function Show(){
  var lf = $("#LoginForm");
  lf.trigger("reset");
  AlertMsg(lf,"");
}

module.exports.Show=Show;