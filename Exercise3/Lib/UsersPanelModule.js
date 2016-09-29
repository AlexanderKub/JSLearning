var $ = require("jquery");
var passwordHash = require("password-hash");
var UserConfig = require("./modules/UserConfig");
var UsersData = require("./modules/UsersData");
var Validation = require("./modules/Validation");
var Alerts = require("./modules/Alerts");

var Tpl = require("../Templates/MainWindow.ejs");
var TplUW = require("../Templates/UsersWindow.ejs");

module.exports=function(){
  var page = $("#page");
  page.append(Tpl);
  var mainWind = $("#MainWindow");
  mainWind.append(TplUW);

  var info = UserConfig.UserInfo();
  $("#StatusBar").html(info.name+"("+info.login+")");
  ShowIt();

  var form = $("#AddEditUserForm");
  form.css("display","none");

  form.on("submit", function(event) {
    event.preventDefault();
    var data={
      login: form.find("#username").val().trim(),
      pass: form.find("#password").val().trim(),
      name: form.find("#name").val().trim(),
      role: form.find("#roleselect").val().trim()
    };

    if(!Validation.Check("login",data.login)){
      Alerts($("#AddEditUserForm"),Validation.WrongValueMessage("login"));
      return;
    }
  
    if(!Validation.Check("pass",data.pass)){
      Alerts($("#AddEditUserForm"),Validation.WrongValueMessage("pass"));
      return;
    }
      
    if(!Validation.Check("name",data.name)){
      Alerts($("#AddEditUserForm"),Validation.WrongValueMessage("name"));
      return;
    }

    UsersData.GetUser(data.login).then(function (response) {
      if(response!=0){
        Alerts($("#AddEditUserForm"),"Пользователь с таким логином существует!");
        return;
      }else{
        UsersData.SaveUser(data).then(function(){
          Alerts($("#AddEditUserForm"),"<span class='greenCl'>Пользователь создан!</span>");
          ShowIt();
        });
      }
    });
  });
};

function DropFilter(){
  var filter = $("#filter");
  var flag = UserConfig.UserFilterOpened();
  flag = !flag;
  UserConfig.UserFilterOpened(flag);
  filter.css("display",flag?"block":"none");
  $("#ufilterdrop").html(flag?"Фильтр &#149;":"Фильтр ▼");
}

function UFilterChange(){
  var tmp = [];
  tmp[0]=$("#ufilter1").prop("checked")?1:0;
  tmp[1]=$("#ufilter2").prop("checked")?1:0;
  tmp[2]=$("#ufilter3").prop("checked")?1:0;
  UserConfig.UsersFilter(tmp);
  ShowIt();
}

function SideUserMenuClick(x){
  AddNewUserFormShow(false);
  var Tpl1 = require("../Templates/EditUserForm.ejs");
  var result = Tpl1({items: UserConfig.UsersList()[x]});
  $("#UsersContentEdit").html(result);
  $("#EditUserBtn").on("click",
      (function(i){ return function(){ChangeUserInfo(i);};})(x));
  $("#DelUserBtn").on("click",
      (function(i){ return function(){DeleteUserFromList(i);};})(x));
}

function ChangeUserInfo(x){
  var form = $("#UsersContentEdit");
  var data={
    login:  UserConfig.UsersList()[x].login,
    pass: form.find("#newpw").val().trim(),
    name: form.find("#newnm").val().trim(),
    role: form.find("#rlsl").val().trim()
  };

  if(!passwordHash.isHashed(data.pass) && !Validation.Check("pass",data.pass)){
    Alerts($("#UsersContentEdit"),Validation.WrongValueMessage("pass"));
    return;
  }

  if(!Validation.Check("role",data.role)){
    Alerts($("#UsersContentEdit"),Validation.WrongValueMessage("")+": "+data.role);
    return;
  }
    
  if(!Validation.Check("name",data.name)){
    Alerts($("#UsersContentEdit"),Validation.WrongValueMessage("name"));
    return;
  }

  UsersData.SaveUser(data).then(function(){
    var tmp = UserConfig.UsersList();
    tmp[x]=data;
    UserConfig.UsersList(tmp);
    $("#UL"+x).html(UserConfig.UsersList()[x].name);
    if(!(UserConfig.UsersList()[x].role in UserConfig.UsersFilter()))
      $("#UL"+x).parentNode.removeChild($("#UL"+x));
    Alerts($("#UsersContentEdit"),"<span class='greenCl'>Изменения сохранены!</span>");
  });
}

function DeleteUserFromList(x){
  var item = UserConfig.UsersList()[x];
  if(!confirm("Действительно удалить запись о пользователе "+
      item.name+"("+item.login+")?"))return;
  UsersData.DeleteUser(item.login).then(function (response) {
    if(response){
      $("#UsersContentEdit").html("");
      $("#UL"+x).remove();
      location.hash="Users";
    }
  });
}

function AddNewUserFormShow(flag){
  var form = $("#AddEditUserForm");
  form.css("display",(flag?"block":"none"));
  $("#UsersContentEdit").html("");
  form.trigger("reset");
  Alerts(form,"");
}

function ShowIt(){
  $("#MB1").css("backgroundColor","");
  $("#MB2").css("backgroundColor","#d9dee2");
  return UsersData.GetUsersList(UserConfig.UsersFilter()).then(function (response) {
    UserConfig.UsersList(response);

    var Tpl1 = require("../Templates/UsersList.ejs");
    var result = Tpl1({UFO:UserConfig.UserFilterOpened(),items:UserConfig.UsersList()});
    $("#UsersMenu").html(result);
    var filt = UserConfig.UsersFilter();
    var uf1 = $("#ufilter1");
    var uf2 = $("#ufilter2");
    var uf3 = $("#ufilter3");
    uf1.attr("checked",filt[0]==1);
    uf2.attr("checked",filt[1]==1);
    uf3.attr("checked",filt[2]==1);
    uf1.on("change",function(){UFilterChange();});
    uf2.on("change",function(){UFilterChange();});
    uf3.on("change",function(){UFilterChange();});

    $("#ufilterdrop").on("click",function(event){event.preventDefault(); DropFilter();});

    for (var it in UserConfig.UsersList()) {
      $("#UL"+it).on("click",it,(function(i){ return function(event){SideUserMenuClick(event.data);};}));
    }
    $("#UsersContentEdit").html("");
  });
}

function ShowUserInfo(log){
  ShowIt().then(function () {
    var list = UserConfig.UsersList();
    for(var i=0; i<list.length; i++){
      if(list[i].login==log) SideUserMenuClick(i);
    }
  });
}

module.exports.Show=ShowIt;
module.exports.AddNewUserFormShow=AddNewUserFormShow;
module.exports.ShowUserInfo=ShowUserInfo;
