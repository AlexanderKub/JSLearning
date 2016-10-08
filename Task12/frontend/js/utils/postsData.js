var ajax = require("./ajax");

exports.likePost = function (id,userId) {
  var SData = {
    "userDataId": userId
  };
  return ajax("posts/"+id+"/likes","POST",SData).then(
    function (response) {
      return (response.id>0);
    }
  );
};