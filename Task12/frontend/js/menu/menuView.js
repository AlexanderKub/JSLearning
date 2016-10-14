import $ from "jquery";
import Backbone from "backbone";
import _ from "underscore";

import tmpl from "./templates/menuTemplate.ejs";

var offset;
var offsetDelta;
let feedList = Backbone.View.extend({
  events: {
    "click .menuShadow": "hideMenu",
    "touchend .menuShadow": "hideMenu",
    "touchstart .menuContent": "moveMenuStart",
    "touchmove .menuContent": "moveMenu",
    "touchend .menuContent": "moveMenuEnd",
    "click .logoutItem": "logout"
  },

  template: tmpl,

  initialize: function () {
    this.$el.html(this.template());
    $("#userName").html(sessionStorage.getItem("User.login"));
  },

  moveMenuStart: function (e) {
    offset = e.changedTouches[0].clientX - 340;
  },

  hideMenu: function () {
    $(".menu.show").toggleClass("show");
  },

  moveMenu: function (e) {
    offsetDelta = offset - (e.changedTouches[0].clientX - 340);
    offset = e.changedTouches[0].clientX - 340;
    if(offset > 0) offset = 0;
    if(offset < -320) offset = -320;
    $(".menuContent").addClass("moved");
    $(".moved").css({ "transform": "translate("+offset+"px,0)"});
  },

  moveMenuEnd: function (e) {
    var mc = $(".menuContent");
    if(mc.hasClass("moved")) {
      offsetDelta = offset - (e.changedTouches[0].clientX - 340);
      $(".moved").css({ "transform": ""});
      mc.removeClass("moved");
      if(offset < -125 || offsetDelta > 3){
        this.hideMenu();
      }
    }
  },

  logout: function () {
    this.hideMenu();
    _.delay(function () {
      sessionStorage.removeItem("User.token");
      sessionStorage.removeItem("User.login");
      Backbone.history.navigate("auth",  {trigger: true});
    },350);
  }

});

export default feedList;