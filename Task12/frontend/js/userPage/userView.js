import $ from "jquery";
import Backbone from "backbone";
import _ from "underscore";

import tmpl from "./templates/userTemplate.ejs";
import Posts from "../collections/posts";
import FeedView from "../feedPage/feedItem";
//import SubsCollection from "../collections/subs";
import Header from "../basic/menuHeader";
import Menu from "../menu/menuView";
import BasicFooter from "../basic/basicFooter";

let feedList = Backbone.View.extend({
  events: {
    "click td": "navigation",
    "click .scrollTopButton": "scrollTop"
  },

  template: tmpl,

  initialize: function (options) {
    this.$el.html(this.template());
    this.header = new Header({el: $("header"),
      title: options.uid == sessionStorage.getItem("User.id") ? "Моя страница" : "Пользователь"});
    this.menu = new Menu({el: $("#menu-wrapper")});
    this.footer = new BasicFooter({el: $("footer")});
    this.coll = new Posts({userID:options.uid});
    this.listenTo(this.coll, "sync", this.render);
    this.listenTo(this.coll, "create", this.render);
    this.coll.fetch();
  },

  render: function () {
    const tbody = this.$("tbody");
    tbody.html("");
    _.each(this.coll.models, function (model) {
      const modelView = new FeedView({
        model: model
      });
      modelView.render();
      tbody.append(modelView.$el);
    }, this);
    $(".loader").removeClass("show");
  },

  navigation: function () {
    console.log("test");
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
      topButton.removeClass("show");
    } else {
      topButton.addClass("show");
    }
  },

  scrollTop: function () {
    $("#scroll-content").stop().animate({scrollTop:0}, "500", "swing", function() {});
  }
});

export default feedList;