//Инициализация
var MyFramework = require('./Framework');
var LoginModule = require('./LoginModule');
var RegisterModule = require('./RegisterModule');
var UsersPanelModule = require('./UsersPanelModule');
var AppsModule = require('./RestoreAppsModule');

var Tpl = require('../Templates/Authorization.ejs');
$('#page').append(Tpl);
var Tpl = require('../Templates/Registration.ejs');
$('#page').append(Tpl);
var Tpl = require('../Templates/MainWindow.ejs');
$('#page').append(Tpl);
var Tpl = require('../Templates/UsersWindow.ejs');
$('#MainWindow').append(Tpl);
var Tpl = require('../Templates/AppsWindow.ejs');
$('#MainWindow').append(Tpl);

SetWindow("LogonWindow");
LoginModule();
RegisterModule();
UsersPanelModule();
AppsModule();

//Главное окно
$("#MB1").on("click",function(){
	SetFrame("AppsFrame");
	event.preventDefault();
});
$("#MB2").on("click",function(){
	SetFrame("UsersFrame");
	event.preventDefault();
});

function SetWindow(name){
	var windowsList=document.getElementsByClassName("WindowClass");
	for (var i = 0; i < windowsList.length; i++) 
		windowsList[i].style.display=(windowsList[i].id==name?"block":"none");
	
	if(name=="MainWindow"){
		SetFrame("AppsFrame");
		$("#MB2").css('display',(config.UserInfo.role==0?"inline":"none"));
		$("#StatusBar").html(config.UserInfo.name+"("+config.UserInfo.login+")");
		return;
	}	
	
	if(name=="RegWindow"){
		RegisterModule.Show();
		return;
	}
	
	if(name=="LogonWindow"){
		LoginModule.Show();
		return;
	}
}

function SetFrame(name){
	var frameList=document.getElementsByClassName("FrameClass");
	for (var i = 0; i < frameList.length; i++)
		frameList[i].style.display=(frameList[i].id==name?"block":"none");
	//Блок заявок
	if(name=="AppsFrame"){
		AppsModule.ShowAppsFrame();
		return;
	}
	AlertMsg($("#AppsFrameMsg"),"");
	AlertMsg($("#DetailAppsFrameMsg"),"");
	
	//Блок детальной информации о заявке
	if(name=="DetailAppsFrame"){
		AppsModule.ShowDetailAppsFrame();
		return;
	}
	
	//Блок создания заявки
	if(name=="CreateAppsFrame"){
		AppsModule.ShowCreateFrame();
		return;
	}	
	
	//Блок информации о пользователях
	if(name=="UsersFrame"){
		UsersPanelModule.Show();
		return;
	}
}

global.SetWindow=SetWindow;
global.SetFrame=SetFrame;
module.exports.AppsModule=AppsModule;