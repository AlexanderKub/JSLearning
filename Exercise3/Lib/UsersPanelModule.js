var MyFramework = require('./Framework');
//Добавление нового пользователя администратором
module.exports=function(){
	$("#AddNewUserFormHref").on("click",
			function(){AddNewUserFormShow(true);});
	$("#AddEditUserForm").css('display','none');
	$("#AddEditUserForm").on("submit", function(event) {
		  event.preventDefault();
		  var data={
		  	login: $("#AddEditUserForm #username").val().trim(),
		  	pass: $("#AddEditUserForm #password").val().trim(),
		  	name: $("#AddEditUserForm #name").val().trim(),
		  	role: $("#AddEditUserForm #roleselect").val().trim()
		  };
		  if(!ValidateValue('login',data.login)){
				AlertMsg($("#AddEditUserForm"),WrongValueMessage('login'));
				return;
		  }
	
		  if(!ValidateValue('pass',data.pass)){
				AlertMsg($("#AddEditUserForm"),WrongValueMessage('pass'));
				return;
		  }
		  
		  if(!ValidateValue('name',data.name)){
				AlertMsg($("#AddEditUserForm"),WrongValueMessage('name'));
				return;
		  }
		  
		  if(UserExist(data.login)){
		  	AlertMsg($("#AddEditUserForm"),"Пользователь с таким логином существует!");
		  	return;
		  }
		  
		  SaveUser(data);
		  AlertMsg($("#AddEditUserForm"),"<font color = 'green'>Пользователь создан!</font>");
		  ShowIt();
		});
}

//Открытие фильтра пользователей
function DropFilter(){
	config.UserFilterOpened=$('#filter').css('display')=='block'?false:true;
	$('#filter').css('display',config.UserFilterOpened?"block":"none");
	$('#ufilterdrop').html(config.UserFilterOpened?"Фильтр &#149;":"Фильтр ▼");
}

//Изменение фильтра пользователей
function UFilterChange(){
	config.UsersFilter=[];
	if($('#ufilter1').prop('checked'))config.UsersFilter[0]=1;
	if($('#ufilter2').prop('checked'))config.UsersFilter[1]=1;
	if($('#ufilter3').prop('checked'))config.UsersFilter[2]=1; 
	ShowIt();
}

//Клик по боковому списку пользователей
function SideUserMenuClick(x){
	AddNewUserFormShow(false);
	var Tpl1 = require('../Templates/EditUserForm.ejs');
	var result = Tpl1({items:config.UsersList[x]});
	$("#UsersContentEdit").html(result);
	$('#EditUserBtn').on('click',
			(function(i){ return function(){ChangeUserInfo(i);}})(x));
	$('#DelUserBtn').on('click',
			(function(i){ return function(){DeleteUserFromList(i);}})(x));
}

//Изменение информации о пользователе
function ChangeUserInfo(x){
	  var data={
			  	login: config.UsersList[x].login,
			  	pass: $("#UsersContentEdit #newpw").val().trim(),
			  	name: $("#UsersContentEdit #newnm").val().trim(),
			  	role: $("#UsersContentEdit #rlsl").val().trim()
			  };
	  
	  if(!ValidateValue('pass',data.pass)){
			AlertMsg($("#UsersContentEdit"),WrongValueMessage('pass'));
			return;
	  }

	  if(!ValidateValue('role',data.role)){
			AlertMsg($("#UsersContentEdit"),WrongValueMessage('')+": "+data.role);
			return;
	  }
	  
	  if(!ValidateValue('name',data.name)){
			AlertMsg($("#UsersContentEdit"),WrongValueMessage('name'));
			return;
	  }
	  
	  SaveUser(data);
	  config.UsersList[x]=data;
	  $("#UL"+x).html(config.UsersList[x].name);
	  if(!(config.UsersList[x].role in config.UsersFilter))
		  $("#UL"+x).parentNode.removeChild($("#UL"+x));
	  AlertMsg($("#UsersContentEdit"),"<font color = 'green'>" +
	  		"Изменения сохранены!</font>");
}

//Удаление пользователя
function DeleteUserFromList(x){
	if(!confirm("Действительно удалить запись о пользователе "+
			config.UsersList[x].name+"("+config.UsersList[x].login+")?"))return;
	if(DeleteUser(config.UsersList[x].login)){
		$("#UsersContentEdit").html("");
		$("#UL"+x).remove();
	}
}

//Показать форму добавления пользователя
function AddNewUserFormShow(flag){
	$("#AddEditUserForm").css('display',(flag?"block":"none"));
	$("#UsersContentEdit").html("");
	$("#AddEditUserForm").trigger('reset');
	AlertMsg($("#AddEditUserForm"),"");
}

function ShowIt(){
	$("#MB1").css('backgroundColor',"");
	$("#MB2").css('backgroundColor',"#d9dee2");
	config.UsersList=GetUsersList(config.UsersFilter);

	var Tpl1 = require('../Templates/UsersList.ejs');
	var result = Tpl1({UFO:config.UserFilterOpened,items:config.UsersList});
	$("#UsersMenu").html(result);
	
	$('#ufilter1').attr('checked',(0 in config.UsersFilter)?true:false);
	$('#ufilter2').attr('checked',(1 in config.UsersFilter)?true:false);
	$('#ufilter3').attr('checked',(2 in config.UsersFilter)?true:false);
	$('#ufilter1').on('change',function(){UFilterChange();});
	$('#ufilter2').on('change',function(){UFilterChange();});
	$('#ufilter3').on('change',function(){UFilterChange();});
	
	$('#ufilterdrop').on('click',function(){DropFilter();});
	
	for (var it in config.UsersList) {
		$('#UL'+it).on('click',
				(function(i){ return function(){SideUserMenuClick(i);}})(it));
	}
	$("#AddEditUserForm").css('display','none');
	$("#UsersContentEdit").html("");
}

module.exports.Show=ShowIt;
module.exports.DropFilter=DropFilter;
module.exports.UFilterChange=UFilterChange;
module.exports.SideUserMenuClick=SideUserMenuClick;
module.exports.ChangeUserInfo=ChangeUserInfo;
module.exports.DeleteUserFromList=DeleteUserFromList;
module.exports.AddNewUserFormShow=AddNewUserFormShow;