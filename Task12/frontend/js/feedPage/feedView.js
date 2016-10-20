import $ from "jquery";
import Backbone from "backbone";
import _ from "underscore";

import tmpl from "./templates/feedWindowTemplate.ejs";
import FeedCollection from "../collections/feeds";
import FeedView from "./feedItem";
import FeedsHeader from "../basic/menuHeader";
import Menu from "../menu/menuView";
import BasicFooter from "../basic/basicFooter";

import userData from "../utils/usersData";
let feedList = Backbone.View.extend({
  events: {
    "click td": "navigation",
    "click .scrollTopButton": "scrollTop"
  },

  template: tmpl,

  initialize: function (options) {
    this.$el.html(this.template());
    this.header = new FeedsHeader({el: $("header"), title: "Лента"});
    this.menu = new Menu({el: $("#menu-wrapper")});
    this.footer = new BasicFooter({el: $("footer")});
    var self = this;
    userData.getUserSubs(options.uid).then(function (response) {
      self.coll = new FeedCollection({subs:response || []});
      self.listenTo(self.coll, "sync", self.render);
      self.listenTo(self.coll, "create", self.render);
      self.coll.fetch();
    });
    $("#scroll-content").on("scroll",this.scrollButton);
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
    for (var i = 0; i<100; i++){
      tbody.append("<tr><td>TEST"+i+"</td></tr>");
    }
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