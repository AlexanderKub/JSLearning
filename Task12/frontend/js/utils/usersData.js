var ajax = require("./ajax");
var md5 = require("js-md5");

exports.AuthUser = function (login,password) {
  var queryParam = {
    "where": {
      "login": login,
      "password": md5(password)
    }
  };
  var params = {
    "login": login,
    "password": md5(password)
  };
  return ajax("userAuth?filter="+JSON.stringify(queryParam),"GET").then(
    function (response) {
      if(response.length!=1) return false;
      return ajax("userAuth/update?where="+JSON.stringify(params),"POST",{}).then(
        function (response) {
          if(!response.token) return false;
          sessionStorage.setItem("User.token",response.token);
          sessionStorage.setItem("User.login",params.login);
          return response.token;
        }
      );
    }
  );
};

exports.isAuthUser = function (login, token) {
  var queryParam = {
    "where": {
      "login": login,
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

exports.GetUserSubs = function (id) {
  var queryParam = {
    "where": {
      "userAuthId": id
    },
    "fields":{
      "subs":true
    }
  };
  return ajax("userData?filter="+JSON.stringify(queryParam),"GET").then(
    function (response) {
      if(response.length!=1) return false;
      return response[0].subs;
    }
  );
};

exports.createUser = function (object){
  var SData= {
    "login": object["login"].toLowerCase(),
    "password": md5(object["password"])
  };

  return ajax("userAuth","POST",SData).then(
    function (response) {
      return (response.id>0)?response.id:false;
    }
  );
};