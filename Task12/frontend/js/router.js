import $ from "jquery";
import Feeds from "./feedPage";
import FeedsHeader from "./feedPage/header";
import Auth from "./authPage";
import Reg from "./regPage";

import {Router} from "backbone";

import userData from "./utils/usersData";
import tmpl from "./index.ejs";
$("#scroll-content").html(tmpl({}));

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
        var view = new Auth({el : router.$el, state: state});
        router.openNewPage(view);
        return;
      }
      router.navigate("feeds", {trigger: true});
    });
  },

  regPage: function () {
    var router = this;
    router.isAuth().then(function (response) {
      if (!response) {
        var view = new Reg({el: router.$el});
        router.openNewPage(view);
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
          var view = new Feeds({el: router.$el, userSubs: response || []});
          router.openNewPage(view, FeedsHeader);
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
  },

  openNewPage(view, header, footer){
    if(header) new header({el: $("header")});
    else $("header").html("");
    if(footer) new footer({el: $("footer")});
    else $("footer").html("");

    var router = this;
    if (router.oldView) router.closeOld();
    $("#scroll-content").append(router.$el);
    router.oldView = view;
  }
});