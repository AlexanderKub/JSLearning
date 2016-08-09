var MyFramework = require('./Framework');
var LogonModule = require('./LoginModule');
//Регистрация
module.exports=function(){
	if(!RegForm)RegForm = $("RegistrationForm");
	RegForm.addEventListener("submit", function(event) {
      event.preventDefault();
	  var data={
	  	login: RegForm.elements[1].value,
	  	pass: RegForm.elements[2].value,
	  	name: RegForm.elements[3].value,
	  	role: (StorageIsClear()?0:2)
	  };
	  
	  if(!ValidateValue('login',data.login)){
			AlertMsg($("RegistrationForm"),WrongValueMessage('login'));
			return;
	  }
	
	  if(!ValidateValue('pass',data.pass)){
			AlertMsg($("RegistrationForm"),WrongValueMessage('pass'));
			return;
	  }
	  
	  if(!ValidateValue('name',data.name)){
			AlertMsg($("RegistrationForm"),WrongValueMessage('name'));
			return;
	  }
	  
	  if(UserExist(data.login)){
	  	AlertMsg($("RegistrationForm"),"Логин занят!");
	  	return;
	  }
	  
	  SaveUser(data);
	  LogonModule.Show;
	  AlertMsg($("LoginForm"),"<font color = 'green'>Успешная регистрация!</font>");
	});
}

module.exports.Show=function(){
	$("RegistrationForm").reset();
	AlertMsg($("RegistrationForm"),'');
}