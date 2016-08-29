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
  
  function dateFormat1(date) {
	  date = new Date(date);
	  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
	  return date.toISOString().replace(/\..*$/, '');
  }
  
  String.prototype.lpad = function(padString, length) {
		var str = this;
	    while (str.length < length)
	        str = padString + str;
	    return str;
  }
  
  //Функции базы данных 
  function Query(url,metod,Sdata){
	  var result;
	  $.ajax({ 
		  url: 'http://localhost:3000/api/'+url, 
		  dataType: 'json', 
		  type: metod,
		  async:false,
		  contentType: 'application/json', 
		  data: JSON.stringify(Sdata), 
		  success: function(data){ 
			  result = data;
		  } 
	  });
	  return result;
  }
  
  //ПОЛЬЗОВАТЕЛИ
  function SaveUser(object){
	  var Sdata={
	        	login: object["login"].toLowerCase(),
	        	pass: object["pass"],
	        	role: object["role"],
	        	name: object["name"],
	        	lastsession: new Date()
	        };
	  if(!UserExist(Sdata.login))
		  Query("AppUsers","POST",Sdata);
	  else
		  Query("AppUsers/update?where=%7B%22login%22%3A%20%22"+Sdata.login
				  +"%22%7D","POST",Sdata);
  }
  
  function GetUser(login){
	  var result;
	  var Sdata={
			  where:{
				  "login":login.toLowerCase()
			  }
	        };
	  result = Query("AppUsers?filter="+JSON.stringify(Sdata),"GET",null);
  	  return result[0];
  }
  
  function DeleteUser(login){
	  if(!UserExist(login))return false;
	  var id = GetUser(login).id;
	  Query("AppUsers/"+id,"DELETE",null);
	  return true;
  }
  
  function UserExist(login){
	  if(!login) return false;
	  var result;
	  var Sdata={
			  where:{
				  "login":login.toLowerCase()
			  }
	        };
	  result = Query("AppUsers?filter="+JSON.stringify(Sdata),"GET",null);
  	  return (result.length>0);
  }
  
  function GetUsersList(filter){
	  filter = filter || false;
	  var result;
	  var Sdata={};
	  if(filter){
		  Sdata={
				where:{
					or:[{"role":(0 in filter)?0:3},
					    {"role":(1 in filter)?1:3},
					    {"role":(2 in filter)?2:3}
					   ]
				}
		  };
	  }
	  result = Query("AppUsers?filter="+JSON.stringify(Sdata),"GET",null);
  	  return result;
  }
  
  function CheckPassword(login,pass){
	  var result;
	  var Sdata={
	        	filter:{
	        		"login":login.toLowerCase(),
	        		"pass":pass
	        		}
	        };
	  result = Query("AppUsers","GET",Sdata);
  	  return (result.length>0);
  }
  
  //ЗАЯВКИ
  function SaveApp(object){
	    var Sdata={
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
	    
	    if(!object["id"]){
			Query("Apps","POST",Sdata);
	    }else{
	    	var getfilter={
	    			id:object["id"]
	    	};
			Query("Apps/update?where="+JSON.stringify(getfilter),"POST",Sdata); 
	    }
  }
  
  function GetApp(id){
	  var result;
	  var Sdata={
			  where:{
				  "id":id
			  }
	        };
	  result = Query("Apps?filter="+JSON.stringify(Sdata),"GET",null);
 	  return result[0];
  }
  
  function DeleteApp(id){
	  if(!AppExist(id))return false;
	  Query("Apps/"+id,"DELETE",null);
	  return true;
  }
  
  function AppExist(id){
	  var result;
	  var Sdata={
			  where:{
				  "id":id
			  }
	        };
	  result = Query("Apps?filter="+JSON.stringify(Sdata),"GET",null);
 	  return (result.length>0);
  }
  
  function GetAppList(filter){	  
	  var result;
	  var Sdata={};
	  if(filter){
		  Sdata={
				where:{
					or:[
					     {"Client":(filter["client"]?
					    		 filter["client"].toLowerCase():"")},
					     {"Executor":(filter["executor"]?
					    		 filter["executor"].toLowerCase():"")}
					]
				}
		  };
	  }
	  if(!filter["client"] && !filter["executor"]){
		  result = Query("Apps","GET",null);
	  }else{
		 result = Query("Apps?filter="+JSON.stringify(Sdata),"GET",null);
	  }
  	  return result;
  }
  
  //КОММЕНТАРИИ
  function SaveComm(object){
	  var result;
	  var Sdata={
	        	App: object["app"],
	        	User: object["user"],
	        	Date: object["date"],
	        	Text: object["text"]
	        };
	  if(!object["id"]){
		  result = Query("Comments","POST",Sdata);
	  } else{
		  result = Query("Comments/update?where=%7B%22id%22%3A%20%22"+object["id"]
				  +"%22%7D","POST",Sdata);
	  }
	  return result;
  }
  
  function GetComm(id){
	  var result;
	  var Sdata={
			  where:{
				  "id":id
			  }
	        };
	  result = Query("Comments?filter="+JSON.stringify(Sdata),"GET",null);
 	  return result[0];
  }
  
  function DeleteComm(id){
	  if(!CommExist(id))return false;
	  Query("Comments/"+id,"DELETE",null);
	  return true;
 }
  
 function CommExist(id){
	 var result;
	  var Sdata={
			  where:{
				  "id":id
			  }
	        };
	  result = Query("Comments?filter="+JSON.stringify(Sdata),"GET",null);
	  return (result.length>0);
 }

  global.GetCommList=function GetCommList(app){
	  var result;
	  var Sdata={
			where:{
				App:app
			}
	  };
	  result = Query("Comments?filter="+JSON.stringify(Sdata),"GET",null);
  	  return result;
  }
  
  function StorageIsClear(){
	  return Query("AppUsers/count","GET",null).count==0;
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
global.AlertMsg=AlertMsg;
global.GetAppsListItem=GetAppsListItem;
global.TextAreaResize=TextAreaResize;
global.ValidateValue=ValidateValue;
global.WrongValueMessage=WrongValueMessage;
global.dateFormat1=dateFormat1;