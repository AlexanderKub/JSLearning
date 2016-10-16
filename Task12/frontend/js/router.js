import $ from "jquery";
import Feeds from "./feedPage/feedView";
import Auth from "./authPage/authView";
import Reg from "./regPage/regView";
import Folowers from "./followers/followersWindow";
import Subs from "./subs/subsWindow";

import {Router} from "backbone";

import userData from "./utils/usersData";
import tmpl from "./index.ejs";
$("#scroll-content").html(tmpl({}));
var loader = $(".loader");

export default Router.extend({
  routes: {
    "auth(/:state)": "authPage",
    "registration": "regPage",
    "feeds": "navigateFeeds",
    "followers": "followersPage",
    "subs": "subsPage",
    "*path": "redirectSections"
  },

  oldView : null,

  $el: $(".content"),

  closeOld: function(){
    if(this.oldView.close) this.oldView.close();
    this.oldView.remove();
    $("#scroll-content").html(tmpl({}));
  },

  loaderBar: function () {
    loader.addClass("show");
  },

  redirectSections : function(){
    var router = this;
    router.isAuth().then(function (response) {
      if(response>0) router.navigate("feeds", {trigger: true});
      else router.navigate("auth", {trigger: true});
    });
  },

  authPage: function (state) {
    var router = this;
    router.isAuth().then(function (response) {
      if (!response) {
        if (router.oldView) router.closeOld();
        router.oldView = new Auth({el : $(".content"), state: state});
        return;
      }
      router.navigate("feeds", {trigger: true});
    });
  },

  regPage: function () {
    var router = this;
    router.isAuth().then(function (response) {
      if (!response) {
        if (router.oldView) router.closeOld();
        router.oldView = new Reg({el: $(".content")});
        return;
      }
      router.navigate("feeds", {trigger: true});
    });
  },

  navigateFeeds: function () {
    var router = this;
    router.loaderBar();
    router.isAuth().then(function (response) {
      if(response>0){
        userData.getUserSubs(response).then(function (response) {
          if (router.oldView) router.closeOld();
          router.oldView = new Feeds({el: $(".content"), userSubs: response || []});
        });
      }else router.navigate("auth", {trigger: true});
    });
  },

  followersPage: function () {
    var router = this;
    router.loaderBar();
    router.isAuth().then(function (response) {
      if(response>0){
        userData.getUserFollowers(response).then(function (response) {
          if (router.oldView) router.closeOld();
          router.oldView = new Folowers({el: $(".content"), followers: response || []});
        });
      }else router.navigate("auth", {trigger: true});
    });
  },

  subsPage: function () {
    var router = this;
    router.loaderBar();
    router.isAuth().then(function (response) {
      if(response>0){
        userData.getUserSubs(response).then(function (response) {
          if (router.oldView) router.closeOld();
          router.oldView = new Subs({el: $(".content"), subs: response || []});
        });
      }else router.navigate("auth", {trigger: true});
    });
  },

  isAuth: function () {
    if(sessionStorage.getItem("User.token"))
      return userData.isAuthUser(sessionStorage.getItem("User.login"),sessionStorage.getItem("User.token"));
    else return new Promise(function (resolve) {
      resolve(0);
    });
  }

});