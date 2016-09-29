exports.UserInfo = function (object){
  if(object){
    var inObject={
      "login" : object.login,
      "name" : object.name,
      "role" : object.role,
      "lastsession" : object.lastsession
    };
    localStorage.setItem("UserInfo",JSON.stringify(inObject));
  }
  return JSON.parse(localStorage.getItem("UserInfo"));
};

exports.UsersList = function (info){
  if(info) localStorage.setItem("UsersList",JSON.stringify(info));
  return JSON.parse(localStorage.getItem("UsersList"));
};

exports.CommsList = function (info){
  if(info) localStorage.setItem("CommsList",JSON.stringify(info));
  return JSON.parse(localStorage.getItem("CommsList"));
};

exports.UsersFilter = function (info){
  if(info) localStorage.setItem("UsersFilter",JSON.stringify(info));
  return JSON.parse(localStorage.getItem("UsersFilter"));
};

exports.UserFilterOpened = function (info){
  if(info==undefined) return JSON.parse(localStorage.getItem("UserFilterOpened"));
  else localStorage.setItem("UserFilterOpened",JSON.stringify(info));
};

exports.TempAppID = function (info){
  if(info) localStorage.setItem("TempAppID",JSON.stringify(info));
  return JSON.parse(localStorage.getItem("TempAppID"));
};