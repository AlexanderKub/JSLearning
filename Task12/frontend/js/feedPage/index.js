import $ from "jquery";
import Backbone from "backbone";
import _ from "underscore";

import tmpl from "./templates/index.ejs";
import FeedCollection from "../collections/feeds";
import FeedView from "./feedItem";

let feedList = Backbone.View.extend({
  events: {
    "click td": "navigation",
    "click .Logout": "logout"
  },

  template: tmpl,

  initialize: function () {
    this.$el.html(this.template());
    this.coll = new FeedCollection();
    this.coll.subs = [1];
    this.listenTo(this.coll, "sync", this.render);
    this.listenTo(this.coll, "create", this.render);
    this.coll.fetch();
  },

  render: function () {
    $("tbody").html("");
    const tbody = this.$("tbody");
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
  },

  logout: function () {
    sessionStorage.removeItem("User.token");
    Backbone.history.navigate("auth",  {trigger: true});
  }
});

export default feedList;