var Query = require("./Quiry");
var passwordHash = require("password-hash");

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

exports.AuthUser = function (login,pass) {
  var queryParam={
    "where" : {
      "login" : login.toLowerCase()
    }
  };
  return Query("AppUsers?filter="+JSON.stringify(queryParam),"GET",null).then(function(response) {
    if(response.length==0) return 0;
    if(!passwordHash.verify(pass,response[0].pass)) return 1;
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
