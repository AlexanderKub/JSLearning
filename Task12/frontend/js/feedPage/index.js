import $ from "jquery";
import Backbone from "backbone";
import _ from "underscore";

import tmpl from "./templates/index.ejs";
import FeedCollection from "../collections/feeds";
import FeedView from "./feedItem";

let feedList = Backbone.View.extend({
  events: {
    "click td": "navigation"
  },

  template: tmpl,

  initialize: function () {
    this.$el.html(this.template());
    this.coll = new FeedCollection();
    this.listenTo(this.coll, "sync", this.render);
    this.listenTo(this.coll, "create", this.render);
    this.coll.fetch();
  },

  render: function () {
    $("tbody").html("");
    const tbody = this.$("tbody");
    console.log("render1");
    _.each(this.coll.models, function (model) {
      const modelView = new FeedView({
        model: model
      });
      modelView.render();
      tbody.append(modelView.$el);
    }, this);
  },

  navigation: function () {
    console.log("test");
  }
});

export default feedList;