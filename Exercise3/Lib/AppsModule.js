var MyFramework = require('./Framework');

//Добавление новой заявки
module.exports=function(){
	  AddNewAppForm.addEventListener("submit", function(event) {
	  event.preventDefault();
	  var data={
	    		id:GetNewAppsID(),
	        	name:AddNewAppForm.elements[1].value,
	        	date:AddNewAppForm.elements[2].value,
	        	client:AddNewAppForm.elements[3].value,
	        	executor:AddNewAppForm.elements[4].value,
	        	discription:AddNewAppForm.elements[5].value,
	            priority:AddNewAppForm.elements[7].value,
	        	estimated:AddNewAppForm.elements[8].value,
	        	deadline:AddNewAppForm.elements[6].value,
	        	progress:AddNewAppForm.elements[9].value
	  };
	  
	  var textvar=data.name.trim();
	  textvar=textvar.replace(/<.*?/g,'');
	  if(textvar!=data.name.trim()){
		  AlertMsg($("NewAppForm"),"Скобки <> запрещенны!");
		  return;
	  }
	  if(!textvar.length){
		  AlertMsg($("NewAppForm"),"Пустое значение названия.");
		  return;
	  }
	  
	  var textvar=data.discription.trim();
	  textvar=textvar.replace(/<.*?/g,'');
	  if(textvar!=data.discription.trim()){
		  AlertMsg($("NewAppForm"),"Скобки <> запрещенны!");
		  return;
	  }
	  
	  if(!textvar.length){
		  AlertMsg($("NewAppForm"),"Пустое значение описания.");
		  return;
	  }
	  
	  if(!UserExist(data.client)){
		  AlertMsg($("NewAppForm"),"Недопустимые данные: "+data.client);
		  return;
	  }
	  
	  if(data.priority<0 || data.priority>2){
		  AlertMsg($("NewAppForm"),"Недопустимые данные: "+data.priority);
		  return;
	  }
	  
	  SaveApp(data);
	  AlertMsg($("AppsFrameMsg"),"<font color = 'green'>Заявка создана!</font>");
	  SetFrame('AppsFrame');
	});
}

function ShowCreateFrame(){
	$("MB1").style.backgroundColor = "#d9dee2";
	$("MB2").style.backgroundColor = "";
	AddNewAppForm.reset();
	AddNewAppForm.elements[2].value=LocalDateTime();
	AddNewAppForm.elements[6].value=LocalDateTime(30);
	AddNewAppForm.elements[8].value=LocalDateTime(30);
	AddNewAppForm.elements[9].value="0";
	if(UserInfo.role==2){
		AddNewAppForm.elements[3].innerHTML="<option value='"+
			UserInfo.login.toLowerCase()+"' selected>"+
			UserInfo.name+"</option>";
		AddNewAppForm.elements[2].disabled="disabled";
		AddNewAppForm.elements[3].disabled="disabled";
		AddNewAppForm.elements[4].disabled="disabled";
		AddNewAppForm.elements[8].disabled="disabled";
		AddNewAppForm.elements[9].disabled="disabled";

		AddNewAppForm.elements[2].hidden="hidden";
		$("NewAppFormDTRow").hidden="hidden";
		$("NewAppFormCERow").hidden="hidden";
		$("NewAppFormDSRow").hidden="hidden";
	}
	
	if(UserInfo.role>0)return;
	
	var ClientList=GetUsersList([,,2]);
	var str="";
	for (var x in ClientList) {
		str+="<option value='"+ClientList[x].login.toLowerCase()+"'>"+
			ClientList[x].name+"</option>";
	}
	$('ClientSelect').innerHTML=str;
	
	var str="<option value='null'>-пусто-</option>";
	var ExecutorList=GetUsersList([,1]);
	for (var x in ExecutorList) {
		str+="<option value='"+ExecutorList[x].login.toLowerCase()+"'>"+
		ExecutorList[x].name+"</option>";
	}
	$('ExecutorSelect').innerHTML=str;
}

function ShowDetailAppsFrame(){
	$("MB1").style.backgroundColor = "#d9dee2";
	$("MB2").style.backgroundColor = "";
	$("CommArea").value="";
	if($("DeleteAppsBtn")!=null)$("DeleteAppsBtn").remove();
	if($("EditAppsBtn")!=null)$("EditAppsBtn").remove();
	if(UserInfo.role==2)return;
	
	var elementbtn=document.createElement('button');
	elementbtn.id='EditAppsBtn';
	elementbtn.className ='btn';
	elementbtn.style="float:right;"
	elementbtn.innerHTML="Изменить";
	$("DetailFrameLabel").appendChild(elementbtn);
	$("EditAppsBtn").addEventListener( "click",function(){
		EditAppsFromDetail();
		});
	if(UserInfo.role==1)return;
	
	var elementbtn=document.createElement('button');
	elementbtn.id='DeleteAppsBtn';
	elementbtn.className ='btn';
	elementbtn.style="float:right;"
	elementbtn.innerHTML="Удалить";
	$("DetailFrameLabel").appendChild(elementbtn);
	$("DeleteAppsBtn").addEventListener( "click",function(){
			DeleteAppsFromDetail();
		});
}

function ShowAppsFrame(){
	$("MB1").style.backgroundColor = "#d9dee2";
	$("MB2").style.backgroundColor = "";
	var str="";
	var filter=[];
	if(UserInfo.role==1) filter["executor"]=UserInfo.login;
	if(UserInfo.role==2) filter["client"]=UserInfo.login;
	
	var AppsList=GetAppList(filter);
	if($("AppsList")!=null)$("AppsList").remove();
	$("AppsFrame").appendChild(GetAppsListItem(AppsList,UserInfo));
	$("AddAppsBtn").style.display=(UserInfo.role==1?"none":"inline-block");
}

//Детальная информация о заявке
function GetDetailInfo(id){
	ShowDetailAppsFrame();
	SetFrame("DetailAppsFrame");
	var Record=AppExist(id)?GetApp(id):false;
	if(Record)TempAppID=id; else return;
	if($("AppsDetail")!=null)$("AppsDetail").remove();
	var element=document.createElement('div');
	element.id='AppsDetail';
	var str="<table class='simple-little-table' cellspacing='0'>";
	str+="<tr><td>Название:</td><td>"+Record.Name+"</td></tr>";
	str+="<tr><td>Дата:</td><td>"+
		(new Date(Date.parse(Record.Date)).toUTCString())+
			"</td></tr>";	
	str+="<tr><td>Клиент:</td><td>"+
		(UserExist(Record.Client)?GetUser(Record.Client).name:"Client")+
			"</td></tr>";
	
	str+="<tr><td>Исполнитель:</td><td>";
	if(UserInfo.role>0)
		str+=(UserExist(Record.Executor)?GetUser(Record.Executor).name:"Executor");
	else{
		str+="<select id='editappexecut'>"+
			"<option value='null'>-пусто-</option>";
		var ExecutorList2=GetUsersList([,1]);
		for (var x in ExecutorList2) {
			str+="<option value='"+ExecutorList2[x].login.toLowerCase()+
			(Record.Executor.toLowerCase()==ExecutorList2[x].login.toLowerCase()?
					"' selected='selected'":"'")+">"+
			ExecutorList2[x].name+"</option>";
		}
	}
	str+="</select>"+"</td></tr>";
	
	str+="<tr><td>Приоритет:</td><td>"+
		(Record.Priority==0?"Низкий":
		  (Record.Priority==1?"Средний":"Высокий"))+"</td></tr>";
	
	str+="<tr><td>Предельный срок:</td><td>";
	if(UserInfo.role>0)
		str+=(new Date(Date.parse(Record.Deadline)).toUTCString())+"</td></tr>";
	else
		str+='<input type="datetime-local" id="editappdeadline"'+
			' value="'+Record.Deadline+'">'+"</td></tr>";
	str+="<tr><td>Предпологаемый срок:</td><td>";
	if(UserInfo.role==2)
		str+=(new Date(Date.parse(Record.Estimated)).toUTCString())+"</td></tr>";
	else
		str+='<input type="datetime-local" id="editappestimated"'+ 
			' value="'+Record.Estimated+'">'+"</td></tr>";
	
	if(UserInfo.role==2)
		str+="<tr><td>Завершено:</td><td>"+Record.Progress+"%</td></tr>";
	else
		str+="<tr><td>Завершено:</td><td><input type='number' " +
			"value='"+Record.Progress+"' min='0' max='100' id='editappstatus'>" +
					"</input>%</td></tr>";
	
	str+="<tr><td colspan='2' style='vertical-align: top;" +
			"'>Описание:<br>"+Record.Discription+"</td></tr>"
	element.innerHTML=str+"</table>";
	$("DetailFrameTable").appendChild(element);

	var str="";
	CommsList=GetCommList(id);
	for (var x in CommsList) {
		str+="<div id='CM"+CommsList[x].ID+"' class='Comms'><div class='CommsHeader'>";
		str+="<div class='CommsUser'>"+(UserExist(CommsList[x].User)?
				GetUser(CommsList[x].User).name:"User")+"</div>";
		str+="<div class='CommsTime'>"+
			new Date(Date.parse(CommsList[x].Date)).toUTCString()+"</div></div>";
		if(UserInfo.role==0 || CommsList[x].User.toLowerCase()==UserInfo.login.toLowerCase())
			str+="<button id='CMDelBtn"+id+"' class='btn' style='float: right;'"+
				"onclick='Main.AppsModule.DeleteComment("+CommsList[x].ID+");' " +
						">"+"Удалить</button>";
		str+="<div class='CommsText'>"+CommsList[x].Text+"</div></div>";
	}
	$("DetailFrameComments").innerHTML=str;
}

//Изменить заявку
function EditAppsFromDetail(){
	var Record=GetApp(TempAppID);
	var data={
    		id:Record.ID,
        	name:Record.Name,
        	date:Record.Date,
        	client:Record.Client,
        	executor:(UserInfo.role==0?$("editappexecut").value:Record.Executor),
        	discription:Record.Discription,
            priority:Record.Priority,
        	estimated:$("editappestimated").value,
        	deadline:(UserInfo.role==0?$("editappdeadline").value:Record.Deadline),
        	progress:$("editappstatus").value
  };
	
  if(data.priority<0 || data.priority>2){
	  AlertMsg($("DetailAppsFrameMsg"),"Недопустимые данные: "+data.priority);
	  return;
  }
  
  if(data.progress<0 || data.progress>100){
	  AlertMsg($("DetailAppsFrameMsg"),"Недопустимые данные: "+data.progress);
	  return;
  }

  SaveApp(data);
  AlertMsg($("DetailAppsFrameMsg"),"<font color = 'green'>Заявка изменена!</font>");
}

//Удалить заявку
function DeleteAppsFromDetail(){
	if(!confirm("Действительно удалить запись о заявке "+
			(AppExist(TempAppID)?GetApp(TempAppID).Name:"")+"?"))return;
	if(DeleteApp(TempAppID)){
		SetFrame('AppsFrame');
	}
}

//Добавить комментарий
function AddComment(){
	  if($("CommArea").value.trim()!=""){
		  
		  var textvar=$("CommArea").value.trim();
		  textvar=textvar.replace(/<.*?/g,'');
		  
		  if(textvar!=$("CommArea").value.trim()){
			  alert('Скобки <> запрещенны!');
			  return;
		  }
		  
		  var data={
    			id: GetNewCommsID(),
    			app: TempAppID,
    			user: UserInfo.login,
    			date: LocalDateTime(),
    			text: textvar
		  };
		  
		  SaveComm(data);
		  $("CommArea").value="";
		  var element=document.createElement('div');
		  element.id='CM'+data.id;
		  element.className ='Comms';
		  var str="<div class='CommsHeader'>";
		  str+="<div class='CommsUser'>"+(UserExist(data.user)?
					GetUser(data.user).name:"User")+"</div>";
		  str+="<div class='CommsTime'>"+
		  			new Date(Date.parse(data.date)).toUTCString()+"</div></div>";
		  if(UserInfo.role==0 || data.user.toLowerCase()==UserInfo.login.toLowerCase())
			  str+="<button class='btn' style='float: right;' " +
			  		"onclick='Main.AppsModule.DeleteComment("+data.id+");' >"
				+"Удалить</button>";
	      str+="<div class='CommsText'>"+data.text+"</div>";
	      element.innerHTML=str;
	      $("DetailFrameComments").appendChild(element);
	  }
}

//Удалить комментарий
function DeleteComment(id){
	if(DeleteComm(id)) $("CM"+id).remove();
}

module.exports.AddComment=AddComment;
module.exports.DeleteComment=DeleteComment;
module.exports.DeleteAppsFromDetail=DeleteAppsFromDetail;
module.exports.EditAppsFromDetail=EditAppsFromDetail;
module.exports.GetDetailInfo=GetDetailInfo;
module.exports.ShowDetailAppsFrame=ShowDetailAppsFrame;
module.exports.ShowCreateFrame=ShowCreateFrame;
module.exports.ShowAppsFrame=ShowAppsFrame;
