import $ from "jquery";
import Backbone from "backbone";
import _ from "underscore";

import tmpl from "./templates/followersTemplate.ejs";
import FollowersCollection from "../collections/followers";
import FollowersView from "./follower";
import Header from "../basic/menuHeader";
import Menu from "../menu/menuView";
import BasicFooter from "../basic/basicFooter";

import userData from "../utils/usersData";
let feedList = Backbone.View.extend({
  events: {
    "click .scrollTopButton": "scrollTop"
  },

  template: tmpl,

  initialize: function (options) {
    this.$el.html(this.template());
    this.header = new Header({el: $("header"),
      title: options.uid == sessionStorage.getItem("User.id") ? " Мои подписчики" : "Подписчики"});
    this.menu = new Menu({el: $("#menu-wrapper")});
    this.footer = new BasicFooter({el: $("footer")});
    var self = this;
    userData.getUserFollowers(options.uid).then(function (response) {
      self.coll = new FollowersCollection({followers:response || []});
      self.listenTo(self.coll, "sync", self.render);
      self.listenTo(self.coll, "create", self.render);
      self.coll.fetch();
    });
  },

  render: function () {
    const tbody = this.$("tbody");
    tbody.html("");
    _.each(this.coll.models, function (model) {
      const modelView = new FollowersView({
        model: model
      });
      modelView.render();
      tbody.append(modelView.$el);
    }, this);
    $(".loader").removeClass("show");
  },

  close: function () {
    this.header.undelegateEvents();
    this.header.$el.empty();
    this.footer.undelegateEvents();
    this.footer.$el.empty();
    this.menu.undelegateEvents();
    this.menu.$el.empty();
  },

  scrollButton: function () {
    var target = $("#scroll-content");
    var topButton = $(".scrollTopButton");
    if(target.prop("scrollTop") < 100) {
      if (topButton.hasClass("show")) topButton.removeClass("show");
    } else {
      if (!topButton.hasClass("show")) topButton.addClass("show");
    }
  },

  scrollTop: function () {
    $("#scroll-content").stop().animate({scrollTop:0}, "500", "swing", function() {});
  }
});

export default feedList;