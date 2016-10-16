import $ from "jquery";
import Backbone from "backbone";
import _ from "underscore";
import usersData from "../utils/usersData";

import tmpl from "./templates/menuTemplate.ejs";

var offset;
var offsetStart;
var offsetDelta;
let feedList = Backbone.View.extend({
  events: {
    "click .menuShadow": "hideMenu",
    "click .menuItemsList ul": "clickItem",
    "touchend .menuShadow": "hideMenu",
    "touchstart .menuContent": "moveMenuStart",
    "touchmove .menuContent": "moveMenu",
    "touchend .menuContent": "moveMenuEnd"
  },

  template: tmpl,

  initialize: function () {
    this.$el.html(this.template());
    usersData.getUserInfo(sessionStorage.getItem("User.id")).then(function (response) {
      $("#profileName").html(response?response.name:"Неизвестный");
    });
  },

  moveMenuStart: function (e) {
    offsetStart = e.changedTouches[0].clientX;
  },

  hideMenu: function () {
    $(".menu.show").toggleClass("show");
  },

  moveMenu: function (e) {
    e.preventDefault();
    offsetDelta = (offsetStart - e.changedTouches[0].clientX);
    offset = -offsetDelta;
    if(offset > 0) offset = 0;
    if(offset < -320) offset = -320;
    $(".menuContent").addClass("moved");
    $(".moved").css({ "transform": "translate("+offset+"px,0)"});
  },

  moveMenuEnd: function () {
    var mc = $(".menuContent");
    if(mc.hasClass("moved")) {
      $(".moved").css({ "transform": ""});
      mc.removeClass("moved");
      if(offset < -125 || offsetDelta > 30){
        this.hideMenu();
      }
    }
  },
  clickItem: function (e) {
    var self = this;
    var target = $(e.target);
    this.hideMenu();
    _.delay(function () {
      self.action(target);
    },350);
  },

  action: function (target) {
    if(target.hasClass("myItem")){
      console.log("myItem");
      return;
    }
    if(target.hasClass("feedsItem")){
      Backbone.history.navigate("feeds",  {trigger: true});
      return;
    }
    if(target.hasClass("searchItem")){
      console.log("searchItem");
      return;
    }
    if(target.hasClass("subsItem")){
      Backbone.history.navigate("subs",  {trigger: true});
      return;
    }
    if(target.hasClass("folowersItem")){
      Backbone.history.navigate("followers",  {trigger: true});
      return;
    }
    if(target.hasClass("settingsItem")){
      console.log("settingsItem");
      return;
    }
    if(target.hasClass("logoutItem")){
      usersData.logout();
      Backbone.history.navigate("auth",  {trigger: true});
    }
  }

});

export default feedList;