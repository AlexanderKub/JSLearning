var MyFramework = require('./Framework');

//Добавление новой заявки
module.exports=function(){
	  $('#NewAppForm').on("submit", function(event) {
	  event.preventDefault();
	  var data={
	    		id:GetNewAppsID(),
	        	name:$('#NewAppForm #appname').val(),
	        	date:$('#NewAppForm #appdate').val(),
	        	client:$('#NewAppForm #ClientSelect').val(),
	        	executor:$('#NewAppForm #ExecutorSelect').val(),
	        	discription:$('#NewAppForm #appdisc').val(),
	            priority:$('#NewAppForm #appprior').val(),
	        	estimated:$('#NewAppForm #appestdate').val(),
	        	deadline:$('#NewAppForm #appdeaddate').val(),
	        	progress:$('#NewAppForm #status').val()
	  };
	  
	  var textvar=data.name.trim();
	  textvar=textvar.replace(/<.*?/g,'');
	  if(textvar!=data.name.trim()){
		  AlertMsg($("#NewAppForm"),"Скобки <> запрещенны!");
		  return;
	  }
	  if(!textvar.length){
		  AlertMsg($("#NewAppForm"),"Пустое значение названия.");
		  return;
	  }
	  
	  var textvar=data.discription.trim();
	  textvar=textvar.replace(/<.*?/g,'');
	  if(textvar!=data.discription.trim()){
		  AlertMsg($("#NewAppForm"),"Скобки <> запрещенны!");
		  return;
	  }
	  
	  if(!textvar.length){
		  AlertMsg($("#NewAppForm"),"Пустое значение описания.");
		  return;
	  }
	  
	  if(!UserExist(data.client)){
		  AlertMsg($("#NewAppForm"),"Недопустимые данные: "+data.client);
		  return;
	  }
	  
	  if(data.priority<0 || data.priority>2){
		  AlertMsg($("#NewAppForm"),"Недопустимые данные: "+data.priority);
		  return;
	  }
	  
	  SaveApp(data);
	  AlertMsg($("#AppsFrameMsg"),"<font color = 'green'>Заявка создана!</font>");
	  SetFrame('AppsFrame');
	});
	  
	$('#FindString').change(function() {
		  console.log('change, but only after the text input is blurred');
		  Find($('#FindString').val());
	});
}

function ShowCreateFrame(){
	$("#MB1").css('backgroundColor',"#d9dee2");
	$("#MB2").css('backgroundColor',"");
	$('#NewAppForm').trigger('reset');
	        	
	$('#NewAppForm #appdate').val(LocalDateTime());
	$('#NewAppForm #appestdate').val(LocalDateTime(30));
	$('#NewAppForm #appdeaddate').val(LocalDateTime(30));
	$('#NewAppForm #status').val(0);
	if(UserInfo.role==2){
		$('#NewAppForm #ClientSelect').html("<option value='"+
			UserInfo.login.toLowerCase()+"' selected>"+
			UserInfo.name+"</option>");
		
		$("#ClientSelect").prop('disabled',true);
		$("#appdate").prop('disabled',true);
		$("#ExecutorSelect").prop('disabled',true);
		$('#NewAppForm #appestdate').prop('disabled',true);
		$('#NewAppForm #status').prop('disabled',true);

		$("#ClientSelect").prop('hidden',true);
		$("#NewAppFormDTRow").prop('hidden',true);
		$("#NewAppFormCERow").prop('hidden',true);
		$("#NewAppFormDSRow").prop('hidden',true);
	}
	
	if(UserInfo.role>0)return;
	
	var Tpl1 = require('../Templates/Selector.ejs');
	var result = Tpl1({empty:false,list:GetUsersList([,,2])});
	$('#ClientSelect').html(result);
	
	var Tpl1 = require('../Templates/Selector.ejs');
	var result = Tpl1({empty:true,list:GetUsersList([,1])});
	$('#ExecutorSelect').html(result);
}

function ShowDetailAppsFrame(){
	$("#MB1").css('backgroundColor',"#d9dee2");
	$("#MB2").css('backgroundColor',"");
	$("#CommArea").val("");
	if($("#DeleteAppsBtn")!=null)$("#DeleteAppsBtn").remove();
	if($("#EditAppsBtn")!=null)$("#EditAppsBtn").remove();
	if(UserInfo.role==2)return;
	
	var elementbtn=document.createElement('button');
	elementbtn.id='EditAppsBtn';
	elementbtn.className ='btn';
	elementbtn.style="float:right;"
	elementbtn.innerHTML="Изменить";
	$("#DetailFrameLabel").append(elementbtn);
	$("#EditAppsBtn").on( "click",function(){
		EditAppsFromDetail();
		});
	if(UserInfo.role==1)return;
	
	var elementbtn=document.createElement('button');
	elementbtn.id='DeleteAppsBtn';
	elementbtn.className ='btn';
	elementbtn.style="float:right;"
	elementbtn.innerHTML="Удалить";
	$("#DetailFrameLabel").append(elementbtn);
	$("#DeleteAppsBtn").on( "click",function(){
			DeleteAppsFromDetail();
		});
}

function ShowAppsFrame(){
	$("#MB1").css('backgroundColor',"#d9dee2");
	$("#MB2").css('backgroundColor',"");
	var str="";
	var filter=[];
	if(UserInfo.role==1) filter["executor"]=UserInfo.login;
	if(UserInfo.role==2) filter["client"]=UserInfo.login;
	
	var AppsList=GetAppList(filter);
	AppListForSort=AppsList;
	if($("#AppsList")!=null)$("#AppsList").parent().remove();
	$("#AppsFrame").append(GetAppsListItem(AppsList,UserInfo));
	$("#AddAppsBtn").css('display',(UserInfo.role==1?"none":"inline-block"));
}

//Детальная информация о заявке
function GetDetailInfo(id){
	ShowDetailAppsFrame();
	SetFrame("DetailAppsFrame");
	var Record=AppExist(id)?GetApp(id):false;
	if(Record)TempAppID=id; else return;
	if($("#AppsDetail")!=null)$("#AppsDetail").remove();
	var Tpl1 = require('../Templates/AppDetail.ejs');
	var result = Tpl1({inRec:Record,inList:GetUsersList([,1])});
	$("#DetailFrameTable").append(result);
	
	
	var str="";
	CommsList=GetCommList(id);
	var Tpl1 = require('../Templates/Comment.ejs');
	for (var x in CommsList) {
		var result = Tpl1({UF:UserInfo,com:CommsList[x]});
		str+=result;
	}
	$("#DetailFrameComments").html(str);
}

//Изменить заявку
function EditAppsFromDetail(){
	var Record=GetApp(TempAppID);
	var data={
    		id:Record.ID,
        	name:Record.Name,
        	date:Record.Date,
        	client:Record.Client,
        	executor:(UserInfo.role==0?$("#editappexecut").val():Record.Executor),
        	discription:Record.Discription,
            priority:Record.Priority,
        	estimated:$("#editappestimated").val(),
        	deadline:(UserInfo.role==0?$("#editappdeadline").val():Record.Deadline),
        	progress:$("#editappstatus").val()
  };
alert(JSON.stringify(data));
  if(data.priority<0 || data.priority>2){
	  AlertMsg($("#DetailAppsFrameMsg"),"Недопустимые данные: "+data.priority);
	  return;
  }
  
  if(data.progress<0 || data.progress>100){
	  AlertMsg($("#DetailAppsFrameMsg"),"Недопустимые данные: "+data.progress);
	  return;
  }

  SaveApp(data);
  AlertMsg($("#DetailAppsFrameMsg"),"<font color = 'green'>Заявка изменена!</font>");
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
	  if($("#CommArea").val().trim()!=""){
		  
		  var textvar=$("#CommArea").val().trim();
		  textvar=textvar.replace(/<.*?/g,'');
		  
		  if(textvar!=$("#CommArea").val().trim()){
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
		  $("#CommArea").val("");
		  
		  var Tpl1 = require('../Templates/Comment.ejs');
		  var result = Tpl1({UF:UserInfo,com:GetComm(data.id)});
		  $("#DetailFrameComments").append(result);
	  }
}

//Удалить комментарий
function DeleteComment(id){
	if(DeleteComm(id)) $("#CM"+id).remove();
}

var AppListForSort;
function Sort(i){
	////////////////Сделать обратную/////////
	AppListForSort=_.sortBy(AppListForSort, function(o) { 
			switch (i) {
			case 1:
				return o.Name;
			case 2:
				return o.Date;
			case 3:
				return o.Client;
			case 4:
				return o.Executor;
			case 5:
				return o.Priority;
			case 6:
				return o.Estimated;
			case 7:
				return o.Deadline;
			case 8:
				return o.Progress;
			default:
				return o.ID;
			} 
		});
	
	if($("#AppsList")!=null)$("#AppsList").parent().remove();
	$("#AppsFrame").append(GetAppsListItem(AppListForSort,UserInfo));
}

function Find(str){
	var filter=[];
	if(UserInfo.role==1) filter["executor"]=UserInfo.login;
	if(UserInfo.role==2) filter["client"]=UserInfo.login;
	
	var AppsList=GetAppList(filter);
	
	AppListForSort=AppsList;
	AppListForSort=_.filter(AppListForSort, _.conforms({ 'Name': function(n) { 
		return n.toLowerCase().indexOf(str.toLowerCase())>=0;}
	}));
	if($("#AppsList")!=null)$("#AppsList").parent().remove();
	$("#AppsFrame").append(GetAppsListItem(AppListForSort,UserInfo));	
}

module.exports.Sort=Sort;
module.exports.AddComment=AddComment;
module.exports.DeleteComment=DeleteComment;
module.exports.DeleteAppsFromDetail=DeleteAppsFromDetail;
module.exports.EditAppsFromDetail=EditAppsFromDetail;
module.exports.GetDetailInfo=GetDetailInfo;
module.exports.ShowDetailAppsFrame=ShowDetailAppsFrame;
module.exports.ShowCreateFrame=ShowCreateFrame;
module.exports.ShowAppsFrame=ShowAppsFrame;