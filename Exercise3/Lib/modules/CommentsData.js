var Query = require("./Quiry");
var UsersData = require("./UsersData");

exports.SaveComm = function SaveComm(object){
  var un;
  return UsersData.GetUser(object["user"]).then(function (response) {
    un = (response.length!=0)?response.name:"User";
    var SData={
      "App": object["app"],
      "User": object["user"],
      "UserName": un,
      "Date": object["date"],
      "Text": object["text"]
    };
    if(!object["id"]){
      return Query("Comments","POST",SData);
    } else{
      var queryParam = {
        "where" : {
          "id" : object["id"]
        }
      };
      return Query("Comments/update?where="+JSON.stringify(queryParam),"POST",SData);
    }
  });
};

exports.GetComm = function GetComm(id){
  var queryParam={
    "where" : {
      "id" : id
    }
  };
  return Query("Comments?filter="+JSON.stringify(queryParam),"GET",null).then(function (response) {
    if(response.length==0) return 0;
    return response[0];
  });
};

exports.DeleteComm = function DeleteComm(id){
  return this.GetComm(id).then(function(response) {
    if (response!=0){
      return Query("Comments/" + id, "DELETE", null).then(function (response) {
        return response.count>0;
      });
    } else return false;
  });
};

exports.GetCommList = function GetCommList(app){
  var queryParam={
    "where" : {
      "App" : app
    }
  };
  return Query("Comments?filter="+JSON.stringify(queryParam),"GET",null);
};