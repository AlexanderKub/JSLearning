var ajax = require("./ajax");

exports.AuthUser = function (login,password) {
  var queryParam = {
    "where": {
      "login": login,
      "password": password
    }
  };
  return ajax("userAuth?filter="+JSON.stringify(queryParam),"GET").then(
    function (response) {
      if(response.length!=1) return false;
      var queryParam = {
        "login": response[0].login,
        "password": response[0].password
      };
      var SData = {
        "session": new Date(),
        "token": createToken()
      };
      return ajax("userAuth/update?where="+JSON.stringify(queryParam),"POST",SData).then(
        function (response) {
          if(response.count!=1) return false;
          sessionStorage.setItem("User.token",SData.token);
          return SData.token;
        }
      );
    }
  );
};

function createToken()
{
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 15; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

exports.isAuthUser = function (token) {
  var queryParam = {
    "where": {
      "token": token
    }
  };
  return ajax("userAuth?filter="+JSON.stringify(queryParam),"GET").then(
    function (response) {
      if(response.length!=1) return false;
      return response[0].id;
    }
  );
};

/*
exports.GetUser = function (login){
  var queryParam={
    "where" : {
      "login" : login.toLowerCase()
    }
  };
  return ajax("users?filter="+JSON.stringify(queryParam),"GET",null).then(function(response) {
    if(response.length==0) return 0;
    return response[0];
  });
};

exports.SaveUser = function (object){
  var SData={
    "login" : object["login"].toLowerCase(),
    "role" : object["role"],
    "name" : object["name"]
  };
  return this.GetUser(SData.login).then(function (response) {
    if(response==0) {
      SData["pass"] = passwordHash.generate(object["pass"]);
      return Query("AppUsers", "POST", SData);
    } else {
      if(!passwordHash.isHashed(object["pass"]))
        SData["pass"] = passwordHash.generate(object["pass"]);
      var queryParam={
        "login" : SData.login
      };
      return Query("AppUsers/update?where="+JSON.stringify(queryParam),"POST",SData);
    }
  });
};

exports.LoginUser = function (login){
  var SData={
    "login" : login.toLowerCase(),
    "lastsession" : new Date()
  };
  return this.GetUser(SData.login).then(function (response) {
    if(response==0) {
      return false;
    } else {
      var queryParam={
        "login" : SData.login
      };
      return Query("AppUsers/update?where="+JSON.stringify(queryParam),"POST",SData);
    }
  });
};

exports.GetUser = function (login){
  var queryParam={
    "where" : {
      "login" : login.toLowerCase()
    }
  };
  return Query("AppUsers?filter="+JSON.stringify(queryParam),"GET",null).then(function(response) {
    if(response.length==0) return 0;
    return response[0];
  });
};

exports.DeleteUser = function (login) {
  return this.GetUser(login).then(function (response) {
    if(response.id){
      var id = response.id;
      return Query("AppUsers/" + id, "DELETE", null).then(function (response) {
        return response.count>0;
      });
    }else return false;
  });
};

exports.GetUsersList = function (filter){
  filter = filter || false;
  var SData={};
  if(filter){
    SData={
      "where" : {
        "or" : [
          {"role":(filter[0]==1)?0:3},
          {"role":(filter[1]==1)?1:3},
          {"role":(filter[2]==1)?2:3}
        ]
      }
    };
  }
  return Query("AppUsers?filter="+JSON.stringify(SData),"GET",null);
};

exports.StorageIsClear = function (){
  return Query("AppUsers/count","GET",null).then(function (respone) {
    return respone.count==0;
  });
};
*/