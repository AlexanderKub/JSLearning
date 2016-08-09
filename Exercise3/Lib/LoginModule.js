var MyFramework = require('./Framework');
//Авторизация
module.exports=function(){
	if(!LoginForm) LoginForm = $("LoginForm");

	LoginForm.addEventListener("submit", function(event) {
	  event.preventDefault();
	  var data={
	  	login: LoginForm.elements[1].value,
	  	pass: LoginForm.elements[2].value
	  };
	  
	  if(!ValidateValue('login',data.login)){
			AlertMsg($("LoginForm"),WrongValueMessage('login'));
			return;
	  }
	  
	  if(!ValidateValue('pass',data.pass)){
			AlertMsg($("LoginForm"),WrongValueMessage('pass'));
			return;
	  }
	  
	  if(!UserExist(data.login))
		AlertMsg($("LoginForm"),'Пользователь не существует!');
	  else{
	    if(!CheckPassword(data.login,data.pass))
	    	AlertMsg($("LoginForm"),'Неверный пароль!');
	    else{
	    	UserInfo=GetUser(data.login);
	    	SaveUser(UserInfo);
	    	SetWindow("MainWindow");
	    }
	  }
	});
	
	$("RegHref").addEventListener("click",function(){
		SetWindow("RegWindow");
		event.preventDefault();
	});

	$("RegHref").addEventListener("click",function(){
		SetWindow("RegWindow");
		event.preventDefault();
	});
	Show();
}

function Show(){
	$("LoginForm").reset();
	AlertMsg($("LoginForm"),'');
}

module.exports.Show=Show;