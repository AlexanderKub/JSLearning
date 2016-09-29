var Query = require("./Quiry");
var UsersData = require("./UsersData");

exports.SaveApp = function (object){
  var cn;
  var en;
  return UsersData.GetUser(object["client"]).then(function (response) {
    cn = (response!=0)?response.name:"Client";
    return UsersData.GetUser(object["executor"]).then(function (response) {
      en = (response!=0)?response.name:"Нет";
      var SData={
        "Name" : object["name"],
        "Date" : object["date"],
        "Client" : object["client"],
        "ClientName" : cn,
        "Executor" : object["executor"],
        "ExecutorName" : en,
        "Discription" : object["discription"],
        "Priority" : object["priority"],
        "Estimated" : object["estimated"],
        "Deadline" : object["deadline"],
        "Progress" : object["progress"]
      };
      if(!object["id"]){
        return Query("Apps","POST",SData);
      }else{
        var queryParam = {
          "id" : object["id"]
        };
        return Query("Apps/update?where="+JSON.stringify(queryParam),"POST",SData);
      }
    });
  });
};

exports.GetApp = function (id){
  var queryParam = {
    "where" : {
      "id" : id
    }
  };
  return Query("Apps?filter="+JSON.stringify(queryParam),"GET",null).then(function (response) {
    if(response.length==0) return 0;
    return response[0];
  });
};

exports.DeleteApp = function (id){
  return this.GetApp(id).then(function(response){
    if(response!=0){
      return Query("Apps/"+id,"DELETE",null).then(function (response) {
        return response.count>0;
      });
    }else return false;
  });
};

exports.GetAppList = function (filter){
  var result;
  var queryParam = {};
  if(filter){
    queryParam = {
      "where" : {
        "or" : [
          {"Client":(filter["client"]? filter["client"].toLowerCase():"")},
          {"Executor":(filter["executor"]? filter["executor"].toLowerCase():"")}
        ]
      }
    };
  }
  if(!filter["client"] && !filter["executor"]){
    result = Query("Apps","GET",null);
  }else{
    result = Query("Apps?filter="+JSON.stringify(queryParam),"GET",null);
  }
  return result;
};