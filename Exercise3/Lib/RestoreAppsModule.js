var MyFramework = require('./Framework');

//Добавление новой заявки
module.exports=function(){
	  $('#NewAppForm').on("submit", function(event) {
	  event.preventDefault();
	  var data={
	    		id:GetNewAppsID(),
	        	name:$('#NewAppForm #appname').val().trim(),
	        	date:$('#NewAppForm #appdate').val().trim(),
	        	client:$('#NewAppForm #ClientSelect').val().trim(),
	        	executor:$('#NewAppForm #ExecutorSelect').val().trim(),
	        	discription:$('#NewAppForm #appdisc').val().trim(),
	            priority:$('#NewAppForm #appprior').val().trim(),
	        	estimated:$('#NewAppForm #appestdate').val().trim(),
	        	deadline:$('#NewAppForm #appdeaddate').val().trim(),
	        	progress:$('#NewAppForm #status').val().trim()
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
		  Find($('#FindString').val().trim());
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
	if(config.UserInfo.role==2){
		$('#NewAppForm #ClientSelect').html("<option value='"+
			config.UserInfo.login.toLowerCase()+"' selected>"+
			config.UserInfo.name+"</option>");
		
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
	
	if(config.UserInfo.role>0)return;
	
	var Tpl1 = require('../Templates/Selector.ejs');
	var result = Tpl1({empty:null,list:GetUsersList([,,2])});
	$('#ClientSelect').html(result);
	
	var Tpl1 = require('../Templates/Selector.ejs');
	var result = Tpl1({empty:"-пусто-",list:GetUsersList([,1])});
	$('#ExecutorSelect').html(result);
}

function ShowDetailAppsFrame(){
	$("#MB1").css('backgroundColor',"#d9dee2");
	$("#MB2").css('backgroundColor',"");
	$("#CommArea").val("");
	if($("#DeleteAppsBtn")!=null)$("#DeleteAppsBtn").remove();
	if($("#EditAppsBtn")!=null)$("#EditAppsBtn").remove();
	if(config.UserInfo.role==2)return;
	
	var elementbtn=document.createElement('button');
	elementbtn.id='EditAppsBtn';
	elementbtn.className ='btn';
	elementbtn.style="float:right;"
	elementbtn.innerHTML="Изменить";
	$("#DetailFrameLabel").append(elementbtn);
	$("#EditAppsBtn").on( "click",function(){
		EditAppsFromDetail();
		});
	if(config.UserInfo.role==1)return;
	
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
	if(config.UserInfo.role==1) filter["executor"]=config.UserInfo.login;
	if(config.UserInfo.role==2) filter["client"]=config.UserInfo.login;
	
	var AppsList=GetAppList(filter);
	AppListForSort=AppsList;
	if($("#AppsList")!=null)$("#AppsList").parent().remove();
	$("#AppsFrame").append(GetAppsListItem(AppsList,config.UserInfo));
	$("#AddAppsBtn").css('display',(config.UserInfo.role==1?"none":"inline-block"));

	var Tpl1 = require('../Templates/Selector.ejs');
	var result = Tpl1({empty:"Все",list:GetUsersList([,,2])});
	$('#FilterClientSelect').html(result);
	$('#FilterClientSelect').on('change',function(){
			Filter($('#FilterClientSelect').val());
		});
}

//Детальная информация о заявке
function GetDetailInfo(id){
	ShowDetailAppsFrame();
	SetFrame("DetailAppsFrame");
	var Record=AppExist(id)?GetApp(id):false;
	if(Record)config.TempAppID=id; else return;
	if($("#AppsDetail")!=null)$("#AppsDetail").remove();
	var Tpl1 = require('../Templates/AppDetail.ejs');
	var result = Tpl1({inRec:Record,inList:GetUsersList([,1]),
		inInfo:config.UserInfo});
	$("#DetailFrameTable").append(result);
	
	
	var str="";
	config.CommsList=GetCommList(id);
	var Tpl1 = require('../Templates/Comment.ejs');
	for (var x in config.CommsList) {
		var result = Tpl1({UF:config.UserInfo,com:config.CommsList[x]});
		str+=result;
	}
	$("#DetailFrameComments").html(str);
}

//Изменить заявку
function EditAppsFromDetail(){
	var Record=GetApp(config.TempAppID);
	var data={
    		id:Record.ID,
        	name:Record.Name,
        	date:Record.Date,
        	client:Record.Client,
        	executor:(config.UserInfo.role==0?$("#editappexecut").val().trim():Record.Executor),
        	discription:Record.Discription,
            priority:Record.Priority,
        	estimated:$("#editappestimated").val().trim(),
        	deadline:(config.UserInfo.role==0?$("#editappdeadline").val().trim():Record.Deadline),
        	progress:$("#editappstatus").val().trim()
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
			(AppExist(config.TempAppID)?GetApp(config.TempAppID).Name:"")+"?"))return;
	if(DeleteApp(config.TempAppID)){
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
    			app: config.TempAppID,
    			user: config.UserInfo.login,
    			date: LocalDateTime(),
    			text: textvar
		  };
		  
		  SaveComm(data);
		  $("#CommArea").val("");
		  
		  var Tpl1 = require('../Templates/Comment.ejs');
		  var result = Tpl1({UF:config.UserInfo,com:GetComm(data.id)});
		  $("#DetailFrameComments").append(result);
	  }
}

//Удалить комментарий
function DeleteComment(id){
	if(DeleteComm(id)) $("#CM"+id).remove();
}

var AppListForSort;
var AppListBeforeFilter;
var LastClick = 0;
function Sort(i){
	////////////////Сделать обратную/////////
	AppListForSort=_.sortBy(AppListForSort, function(o) { 
			switch (i) {
			case 1:
				return o.Name;
			case 2:
				return o.Date;
			case 3:
				if(!UserExist(o.Client)) return "";
				return GetUser(o.Client).name;
			case 4:
				if(!UserExist(o.Executor)) return "";
				return GetUser(o.Executor).name;
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

	if(LastClick==i){
		AppListForSort=AppListForSort.reverse();
		LastClick=0;
	}else LastClick=i;
	
	if($("#AppsList")!=null)$("#AppsList").parent().remove();
	$("#AppsFrame").append(GetAppsListItem(AppListForSort,config.UserInfo));
}

function Find(str){
	var filter=[];
	if(config.UserInfo.role==1) filter["executor"]=config.UserInfo.login;
	if(config.UserInfo.role==2) filter["client"]=config.UserInfo.login;
	
	var AppsList=GetAppList(filter);
	
	AppListBeforeFilter=AppsList;
	AppListBeforeFilter=_.filter(AppListBeforeFilter, _.conforms({ 'Name': function(n) { 
		return n.toLowerCase().indexOf(str.toLowerCase())>=0;}
	}));
	Filter($('#FilterClientSelect').val());
}

function Filter(filt){
	if($('#FindString').val().trim()=='')AppListForSort=AppListBeforeFilter;
	if(filt!='null')
		AppListForSort=_.filter(AppListBeforeFilter, _.conforms({ 'Client': function(n) { 
			return n.toLowerCase()==filt.toLowerCase()}
		}));
	else AppListForSort = AppListBeforeFilter;
	if($("#AppsList")!=null)$("#AppsList").parent().remove();
	$("#AppsFrame").append(GetAppsListItem(AppListForSort,config.UserInfo));
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