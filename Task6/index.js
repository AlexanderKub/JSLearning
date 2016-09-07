  require("./CSS/style.css");
  let $ = require("jquery");

  let figurePage = require("./Lib/figurePage.js");
  let personalPage = require("./Lib/personalPage.js");

  $("#root").html(figurePage.HTML());

  
  $("#sw").on("change",function () {
    if($("#sw").prop("checked")){
      $("#root").html(personalPage.HTML());
    }else{
      $("#root").html(figurePage.HTML());
    }
  });
  

