import Feeds from "./feedPage";
import Auth from "./authPage";
import Reg from "./regPage";

import {Router} from "backbone";
import $ from "jquery";

import userData from "./utils/usersData";
import tmpl from "./index.ejs";
$("#page").html(tmpl({}));

export default Router.extend({
  routes: {
    "auth(/:state)": "authPage",
    "registration": "regPage",
    "feeds": "navigateFeeds",
    "*path" : "redirectSections"
  },

  oldView : null,

  $el: $(".content"),

  closeOld: function(){
    this.oldView.remove();
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
        $("#page").append(router.$el);
        router.oldView = new Auth({el : router.$el, state: state});
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
        $("#page").append(router.$el);
        router.oldView = new Reg({el: router.$el});
        return;
      }
      router.navigate("feeds", {trigger: true});
    });
  },

  navigateFeeds: function () {
    var router = this;
    router.isAuth().then(function (response) {
      if(response>0){
        userData.GetUserSubs(response).then(function (response) {
          if (router.oldView) router.closeOld();
          $("#page").append(router.$el);
          router.oldView = new Feeds({el: router.$el, userSubs: response || []});
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