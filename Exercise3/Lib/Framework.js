var $ = require('jquery');
var config = require('./UserConfig');

global.$=$;
global.config=config;

  //Вспомогательные функции
  function GetRoleFromCode(id){
	  if(id==0) return "Администратор";
	  if(id==1) return "Исполнитель";
	  if(id==2) return "Клиент";
  }
  function LocalDateTime(addDay){
	  var str="";
	  var addDay=addDay || false;
	  var d=new Date();
	  if(addDay)
		  d.setDate(d.getDate() + addDay);
	  str=d.getFullYear() + "-" + (d.getMonth() + 1).toString().lpad("0", 2) +
	  	"-" + d.getDate().toString().lpad("0", 2)+"T"+
	  	d.getHours().toString().lpad("0", 2)+
	  	":"+d.getMinutes().toString().lpad("0", 2);
	  return str;
  }
  
  String.prototype.lpad = function(padString, length) {
		var str = this;
	    while (str.length < length)
	        str = padString + str;
	    return str;
  }
  
  //Функции базы данных  
  function SaveUser(object){
    var data={
        	login: object["login"],
        	pass: object["pass"],
        	role: object["role"],
        	name: object["name"],
        	lastsession: new Date()
        };
	localStorage["admapp.users." + data.login.toLowerCase()]=JSON.stringify(data);  
  }
  function GetUser(login){
	  return JSON.parse(localStorage["admapp.users." + login.toLowerCase()]);
  }
  function DeleteUser(login){
	  if(!UserExist(login))return false;
	  localStorage.removeItem("admapp.users." + login.toLowerCase());
	  return true;
  }
  function UserExist(login){
	  if(!login) return false;
	  return (localStorage["admapp.users." + login.toLowerCase()]!=null);
  }
  function GetUsersList(filter){
	  var list=[];
	  filter= filter || false;
	  for (var i=0; i < localStorage.length; i++) {
		  if(localStorage.key(i).indexOf("admapp.users.")+1){
			  if(!filter)
				  list[i]=JSON.parse(localStorage.getItem(localStorage.key(i))); 
			  else{
				  var tmpobj=JSON.parse(localStorage.getItem(localStorage.key(i)));
				  if(tmpobj.role in filter)
					  list[i]=tmpobj; 
			  }
		  }
	  }
	  return list;
  }
  function CheckPassword(login,pass){
	  return (pass==JSON.parse(localStorage["admapp.users." + 
	                                        login.toLowerCase()]).pass);
  }
  function SaveApp(object){
	    var data={
	    		ID: object["id"],
	        	Name: object["name"],
	        	Date: object["date"],
	        	Client: object["client"],
	        	Executor: object["executor"],
	        	Discription: object["discription"],
	        	Priority: object["priority"],
	        	Estimated: object["estimated"],
	        	Deadline: object["deadline"],
	        	Progress: object["progress"]
	        };
		localStorage["admapp.apps.id" + data.ID.toString()]=JSON.stringify(data);  
  }
  function GetApp(id){
	  if(!AppExist(id))return null;
	  return JSON.parse(localStorage["admapp.apps.id" + id]);
  }
  function DeleteApp(id){
	  if(!AppExist(id))return false;
	  localStorage.removeItem("admapp.apps.id" + id);
	  return true;
  }
  function AppExist(id){
	  return (localStorage["admapp.apps.id" + id]!=null);
  }
  function GetAppList(filter){
	  var list=[];
	  for (var i=0; i < localStorage.length; i++){
		  if(localStorage.key(i).indexOf("admapp.apps.")+1){
			  if(!filter["client"] && !filter["executor"]){
				  list[i]=JSON.parse(localStorage.getItem(localStorage.key(i)));
			  }else{
				  var pre=JSON.parse(localStorage.getItem(localStorage.key(i)));
				  if(filter["client"] && filter["client"].toLowerCase()==
							  pre.Client.toLowerCase()) list[i]=pre;
				  if(filter["executor"] && filter["executor"].toLowerCase()==
							  pre.Executor.toLowerCase()) list[i]=pre;
			  }
		  }
	  }
	  return list;
  }
  function SaveComm(object){
	    var data={
	    		ID: object["id"],
	        	App: object["app"],
	        	User: object["user"],
	        	Date: object["date"],
	        	Text: object["text"]
	        };
		localStorage["admapp.comms.id" + data.ID.toString()]=JSON.stringify(data);  
  }
  function GetComm(id){
	  if(!CommExist(id))return null;
	  return JSON.parse(localStorage["admapp.comms.id" + id]);
  }
  function DeleteComm(id){
	  if(!CommExist(id))return false;
	  localStorage.removeItem("admapp.comms.id" + id);
	  return true;
 }
 function CommExist(id){
	  return (localStorage["admapp.comms.id" + id]!=null);
 }

  global.GetCommList=function GetCommList(app){
	  var list=[];
	  for (var i=0; i < localStorage.length; i++){
		  if(localStorage.key(i).indexOf("admapp.comms.")+1){
				  var pre=JSON.parse(localStorage.getItem(localStorage.key(i)));
				  if(pre.App==app)list[i]=pre;
			  }
		  }
	  return list;
  }
  function StorageIsClear(){
	  return localStorage.length==0;
  }
  
  //Генераторы новых ключей
  function GetNewAppsID(){
	  if(localStorage["admapp.keys.apps"]){
		  var id=parseInt(localStorage["admapp.keys.apps"]);
		  localStorage["admapp.keys.apps"]=id+1;
		  return id;
	  } else{
		  localStorage["admapp.keys.apps"]=1;
		  return 0;
	  }
  }
  function GetNewCommsID(){
	  if(localStorage["admapp.keys.comms"]){
		  var id=parseInt(localStorage["admapp.keys.comms"]);
		  localStorage["admapp.keys.comms"]=id+1;
		  return id;
	  } else{
		  localStorage["admapp.keys.comms"]=1;
		  return 0;
	  }
  }
  
  //Добавление сообщения
  function AlertMsg(parent,text){
	var alerts=$('.alert');
	for (var i = 0; i < alerts.length; i++) $(alerts[i]).remove();

  	var element=document.createElement('div');
	element.className='alert';
	element.innerHTML=text;
	$(parent).append(element);
  }
  
  //Создание списка заявок
  function GetAppsListItem(list,UserInfo){
 	  var element=document.createElement('div');
	  var Tpl1 = require('../Templates/AppList.ejs');
	  var result = Tpl1({inInfo:UserInfo,inList:list});
	  element.innerHTML=result;	
	  return element;
  }
  
  //Расстягивание TextArea
  function TextAreaResize(event, LineHeight, MinLineCount)
  {
    var MinLineHeight = MinLineCount * LineHeight;
    var obj = event.target;
    var div = document.getElementById(obj.id + 'Div');
    div.innerHTML = obj.value;
    var ObjHeight = div.offsetHeight;
    if (event.keyCode == 13)
    	ObjHeight += LineHeight;
    else if (ObjHeight < MinLineHeight)
    	ObjHeight = MinLineHeight;
    obj.style.height = ObjHeight + 'px';
  }
  
  //Валидация
  function ValidateValue(type, value){
	  if(type=="login"){
		  var patt = /^[a-z][a-z0-9]*?([-_][a-z0-9]+){0,2}$/i;
		  if(value.length>3)
			  if(patt.test(value)) return true;
	  }
	  
	  if(type=="pass"){
		  var patt = /^[a-zA-Z0-9]+$/;
		  if(value.length>3)
			  if(patt.test(value)) return true;
	  }
	  
	  if(type=="name"){
		  /*FIX IT*/
		  return true;
		  var patt = /^[а-яА-ЯёЁa-zA-Z0-9]+$/;
		  if(value.length>3 && value.length<51)
			  if(patt.test(value)) return true;
	  }
	  
	  if(type=="role"){ 
		  var patt = /^[0-9]+$/;
		  if(value.length==1)
			  if(patt.test(value)) return true;
	  }
	  
	  return false;
  }
  
  function WrongValueMessage(type){
	  if(type=="login")
		  return "Недопустимый логин. Логин должен "+
			"содержать не менее 4х символов и начинаться с буквы " +
			"латинского алфавита, заканчиваться буквой/цифрой. " +
			"Может состоять из цифр и латинские букв, " +
			"а также не более двух, не идущих подряд символов '-' и '_'.";
	  if(type=="pass")
		  return "Недопустимый пароль. Пароль должен содержать не менее " +
		  		"4х символов, состоять только из цифр и латинских букв.";
	  if(type=="name")
		  return "Недопустимое имя. Имя должно содержать не менее 3 и " +
		  		"не более 50 символов. Состоять из букв и цифр.";
	  return "Недопустимое значение";
  }
 
global.GetRoleFromCode=GetRoleFromCode;
global.LocalDateTime=LocalDateTime;
global.SaveUser=SaveUser;
global.GetUser=GetUser;
global.DeleteUser=DeleteUser;
global.UserExist=UserExist;
global.GetUsersList=GetUsersList;
global.CheckPassword=CheckPassword;
global.SaveApp=SaveApp;
global.GetApp=GetApp;
global.DeleteApp=DeleteApp;
global.AppExist=AppExist;
global.GetAppList=GetAppList;
global.SaveComm=SaveComm;
global.GetComm=GetComm;
global.DeleteComm=DeleteComm;
global.CommExist=CommExist;
global.StorageIsClear=StorageIsClear;
global.GetNewAppsID=GetNewAppsID;
global.GetNewCommsID=GetNewCommsID;
global.AlertMsg=AlertMsg;
global.GetAppsListItem=GetAppsListItem;
global.TextAreaResize=TextAreaResize;
global.ValidateValue=ValidateValue;
global.WrongValueMessage=WrongValueMessage;