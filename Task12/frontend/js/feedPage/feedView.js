import $ from "jquery";
import Backbone from "backbone";
import _ from "underscore";

import tmpl from "./templates/feedWindowTemplate.ejs";
import FeedCollection from "../collections/feeds";
import FeedView from "./feedItem";
import FeedsHeader from "./feedHeader";
import Menu from "../menu/menuView";
import BasicFooter from "../basic/basicFooter";

let feedList = Backbone.View.extend({
  events: {
    "click td": "navigation"
  },

  template: tmpl,

  initialize: function (options) {
    this.$el.html(this.template());
    this.coll = new FeedCollection({subs:options.userSubs});
    this.listenTo(this.coll, "sync", this.render);
    this.listenTo(this.coll, "create", this.render);
    this.coll.fetch();
  },

  render: function () {
    this.header = new FeedsHeader({el: $("header")});
    this.menu = new Menu({el: $("#menu-wrapper")});
    this.footer = new BasicFooter({el: $("footer")});
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
  },

  navigation: function () {
    console.log("test");
  }
});

export default feedList;