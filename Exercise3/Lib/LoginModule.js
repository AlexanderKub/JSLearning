var MyFramework = require('./Framework');

//Авторизация
module.exports=function(){
	$("#LoginForm").on("submit", function(event) {
	  event.preventDefault();
	  var data={
	  	login: $("#LoginForm #username").val(),
	  	pass: $("#LoginForm #password").val()
	  };
	  if(!ValidateValue('login',data.login)){
			AlertMsg($("#LoginForm"),WrongValueMessage('login'));
			return;
	  }
	  
	  if(!ValidateValue('pass',data.pass)){
			AlertMsg($("#LoginForm"),WrongValueMessage('pass'));
			return;
	  }
	  
	  if(!UserExist(data.login))
		AlertMsg($("#LoginForm"),'Пользователь не существует!');
	  else{
	    if(!CheckPassword(data.login,data.pass))
	    	AlertMsg($("#LoginForm"),'Неверный пароль!');
	    else{
	    	UserInfo=GetUser(data.login);
	    	SaveUser(UserInfo);
	    	SetWindow("MainWindow");
	    }
	  }
	});
	
	$("#RegHref").on("click",function(){
		SetWindow("RegWindow");
		event.preventDefault();
	});

	$("#RegHref").on("click",function(){
		SetWindow("RegWindow");
		event.preventDefault();
	});
	Show();
}

function Show(){
	$("#LoginForm").trigger('reset');
	AlertMsg($("#LoginForm"),'');
}

module.exports.Show=Show;