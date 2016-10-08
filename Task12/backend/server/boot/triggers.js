module.exports = function (app) {
  var UserAuth = app.models.userAuth;
  var UserInfo = app.models.userInfo;
  var UserData = app.models.userData;

  UserAuth.observe("before save",function (ctx, next) {
    if(!ctx.instance){
      if(ctx.where.hasOwnProperty("login") && ctx.where.hasOwnProperty("password")){
        ctx.data.session = new Date();
        ctx.data.token = createToken();
      }
    }
    next();
  });

  UserAuth.observe("after save",function (ctx, next) {
    if(ctx.isNewInstance){
      var info = {"userAuthId":ctx.instance.id, "name":"User"+ctx.instance.id};
      UserInfo.create(info,function (err, obj) {
        if(err) next(err);
        console.log("Created: ", obj.toObject());
      });
      var data = {"userAuthId":ctx.instance.id, "subs":[], "folowers":[]};
      UserData.create(data,function (err, obj) {
        if(err) next(err);
        console.log("Created: ", obj.toObject());
      });
    }
    next();
  });

  UserAuth.afterRemote("**",function (ctx, obj, next) {
    if("count" in ctx.result){
      ctx.result = {"token": (ctx.result.count==1)?ctx.args.data.token:false};
    }else{
      var whiteList = ["login", "session", "token", "id", "count", "error"];
      ctx.result = outputParams(ctx.result, whiteList);
    }
    next();
  });

  UserAuth.observe("after delete",function (ctx, next) {
    UserInfo.destroyAll({"userAuthId": ctx.where.id},function (err, info) {
      if(err) next(err);
      console.log("Destoy Info: ", info.count);
    });
    UserData.destroyAll({"userAuthId": ctx.where.id},function (err, info) {
      if(err) next(err);
      console.log("Destoy Data: ", info.count);
    });
    next();
  });

  function outputParams(ctx, whiteList) {
    var answer;
    if(ctx){
      if(Array.isArray(ctx)){
        answer = [];
        ctx.forEach(function (result) {
          var replacement = {};
          whiteList.forEach(function (field) {
            if(field in result) {
              replacement[field] = result[field];
            }
          });
          answer.push(replacement);
        });
      }else{
        answer = {};
        whiteList.forEach(function (field) {
          if(field in ctx) answer[field] = ctx[field];
        });
      }
      return answer;
    }
    return false;
  }

  function createToken() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 17; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }
};
