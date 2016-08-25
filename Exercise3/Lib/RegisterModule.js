var MyFramework = require('./Framework');
var LogonModule = require('./LoginModule');
//Регистрация
module.exports=function(){
	$("#RegistrationForm").on("submit", function(event) {
      event.preventDefault();
	  var data={
	  	login: $("#RegistrationForm #username").val().trim(),
	  	pass: $("#RegistrationForm #password").val().trim(),
  	    name: $("#RegistrationForm #name").val().trim(),
	  	role: (StorageIsClear()?0:2)
	  };
	  
	  if(!ValidateValue('login',data.login)){
			AlertMsg($("#RegistrationForm"),WrongValueMessage('login'));
			return;
	  }
	
	  if(!ValidateValue('pass',data.pass)){
			AlertMsg($("#RegistrationForm"),WrongValueMessage('pass'));
			return;
	  }
	  
	  if(!ValidateValue('name',data.name)){
			AlertMsg($("#RegistrationForm"),WrongValueMessage('name'));
			return;
	  }
	  
	  if(UserExist(data.login)){
	  	AlertMsg($("#RegistrationForm"),"Логин занят!");
	  	return;
	  }
	  
	  SaveUser(data);
	  SetWindow("LogonWindow");
	  LogonModule.Show;
	  AlertMsg($("#LoginForm"),"<font color = 'green'>Успешная регистрация!</font>");
	});
}

module.exports.Show=function(){
	$("#RegistrationForm").trigger('reset');
	AlertMsg($("#RegistrationForm"),'');
}