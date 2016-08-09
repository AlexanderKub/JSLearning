var MyFramework = require('./Framework');
//Добавление нового пользователя администратором
module.exports=function(){
	$("AddNewUserFormHref").addEventListener("click",
			function(){AddNewUserFormShow(true);});
	if(!AddNewUserForm)AddNewUserForm = $("AddEditUserForm");
	AddNewUserForm.style.display="none";
	AddNewUserForm.addEventListener("submit", function(event) {
		  event.preventDefault();
		  var data={
		  	login: AddNewUserForm.elements[1].value,
		  	pass: AddNewUserForm.elements[2].value,
		  	name: AddNewUserForm.elements[3].value,
		  	role: AddNewUserForm.elements[4].value
		  };
		  
		  if(!ValidateValue('login',data.login)){
				AlertMsg($("AddEditUserForm"),WrongValueMessage('login'));
				return;
		  }
	
		  if(!ValidateValue('pass',data.pass)){
				AlertMsg($("AddEditUserForm"),WrongValueMessage('pass'));
				return;
		  }
		  
		  if(!ValidateValue('name',data.name)){
				AlertMsg($("AddEditUserForm"),WrongValueMessage('name'));
				return;
		  }
		  
		  if(UserExist(data.login)){
		  	AlertMsg($("AddEditUserForm"),"Пользователь с таким логином существует!");
		  	return;
		  }
		  
		  SaveUser(data);
		  AlertMsg($("AddEditUserForm"),"<font color = 'green'>Пользователь создан!</font>");
		 // SetFrame("UsersFrame");
		  ShowIt();
		});
}

//Открытие фильтра пользователей
function DropFilter(){
	UserFilterOpened=$('filter').style.display=='block'?false:true;
	$('filter').style.display=UserFilterOpened?"block":"none";
	$('ufilterdrop').innerHTML=UserFilterOpened?"Фильтр &#149;":"Фильтр ▼";
}

//Изменение фильтра пользователей
function UFilterChange(){
	UsersFilter=[];
	if($('ufilter1').checked)UsersFilter[0]=1;
	if($('ufilter2').checked)UsersFilter[1]=1;
	if($('ufilter3').checked)UsersFilter[2]=1; 
	//SetFrame("UsersFrame");
	ShowIt();
}

//Клик по боковому списку пользователей
function SideUserMenuClick(x){
	AddNewUserFormShow(false);
	var str="Логин: "+UsersList[x].login+" <button class='btn' id='DelUserBtn'>" +
					"Удалить</button>" +
					"<br>Пароль: <input id='newpw' required type='text' value='"+
					UsersList[x].pass+"'><br> Роль: "+
					"<select id='rlsl'>"+
					"<option value='2'"+(UsersList[x].role==2?
					"selected='selected'":"")+">Клиент</option>"+
					"<option value='1'"+(UsersList[x].role==1?
					"selected='selected'":"")+">Исполнитель</option>"+
					"<option value='0'"+(UsersList[x].role==0?
					"selected='selected'":"")+">Администратор</option>"+
					"</select><br>Имя: <input id='newnm' required " +
					"type='text' value='"+UsersList[x].name+"'>";
	str+="<br><button class='btn' id='EditUserBtn'>" +
		"Изменить</button>";
	$("UsersContentEdit").innerHTML=str;
	$('EditUserBtn').addEventListener('click',
			(function(i){ return function(){ChangeUserInfo(i);}})(x));
	$('DelUserBtn').addEventListener('click',
			(function(i){ return function(){DeleteUserFromList(i);}})(x));
}

//Изменение информации о пользователе
function ChangeUserInfo(x){
	  var data={
			  	login: UsersList[x].login,
			  	pass: $("newpw").value,
			  	name: $("newnm").value,
			  	role: $("rlsl").value
			  };

	  if(!ValidateValue('pass',data.pass)){
			AlertMsg($("UsersContentEdit"),WrongValueMessage('pass'));
			return;
	  }
	  
	  if(!ValidateValue('name',data.name)){
			AlertMsg($("UsersContentEdit"),WrongValueMessage('name'));
			return;
	  }

	  if(!ValidateValue('role',data.role)){
			AlertMsg($("UsersContentEdit"),WrongValueMessage('')+": "+data.role);
			return;
	  }
	  
	  SaveUser(data);
	  UsersList[x]=data;
	  $("UL"+x).innerHTML=UsersList[x].name;
	  if(!(UsersList[x].role in UsersFilter))$("UL"+x).parentNode.removeChild($("UL"+x));
	  AlertMsg($("UsersContentEdit"),"<font color = 'green'>Изменения сохранены!</font>");
}

//Удаление пользователя
function DeleteUserFromList(x){
	if(!confirm("Действительно удалить запись о пользователе "+
			UsersList[x].name+"("+UsersList[x].login+")?"))return;
	if(DeleteUser(UsersList[x].login)){
		$("UsersContentEdit").innerHTML="";
		$("UL"+x).remove();
	}
}

//Показать форму добавления пользователя
function AddNewUserFormShow(flag){
	AddNewUserForm.style.display=flag?"block":"none";
	$("UsersContentEdit").innerHTML="";
	AddNewUserForm.reset();
	AlertMsg($("AddEditUserForm"),"");
}

function ShowIt(){
	$("MB1").style.backgroundColor = "";
	$("MB2").style.backgroundColor = "#d9dee2";
	UsersList=GetUsersList(UsersFilter);
	var str="<ul><li><a href='#' id='ufilterdrop'" +
			" style='color:blue;'>"+
			(UserFilterOpened?"Фильтр &#149;":"Фильтр ▼")+
			"</a><div id='filter' style='display: "+
			(UserFilterOpened?"block":"none")+
			"; padding-left: 40px;'>" +
			"Администраторы <input id='ufilter1' " +
			"type='checkbox'>"+
			"<br>Исполнители<input id='ufilter2' type='checkbox'>"+
			"<br>Клиенты<input id='ufilter3' type='checkbox' ></div></li>";
	
	for (var x in UsersList) {
		str+="<li><a href='#' id='UL"+x+"'>"
		+UsersList[x].name+"</a></li>";
	}
	str+="</ul>";
	$("UsersMenu").innerHTML=str;
	$('ufilter1').checked =(0 in UsersFilter)?"checked":"";
	$('ufilter2').checked =(1 in UsersFilter)?"checked":"";
	$('ufilter3').checked =(2 in UsersFilter)?"checked":"";
	$('ufilter1').addEventListener('change',function(){UFilterChange();});
	$('ufilter2').addEventListener('change',function(){UFilterChange();});
	$('ufilter3').addEventListener('change',function(){UFilterChange();});
	
	$('ufilterdrop').addEventListener('click',function(){DropFilter();});
	
	for (var it in UsersList) {
		$('UL'+it).addEventListener('click',
				(function(i){ return function(){SideUserMenuClick(i);}})(it));
	}
	AddNewUserForm.style.display="none";
	$("UsersContentEdit").innerHTML="";
}

module.exports.Show=ShowIt;
module.exports.DropFilter=DropFilter;
module.exports.UFilterChange=UFilterChange;
module.exports.SideUserMenuClick=SideUserMenuClick;
module.exports.ChangeUserInfo=ChangeUserInfo;
module.exports.DeleteUserFromList=DeleteUserFromList;
module.exports.AddNewUserFormShow=AddNewUserFormShow;