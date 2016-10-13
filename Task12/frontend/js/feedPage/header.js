import $ from "jquery";
import Backbone from "backbone";
import _ from "underscore";

import tmpl from "./templates/header.ejs";

let feedList = Backbone.View.extend({
  events: {
    "click .Logout": "logout"
  },

  template: tmpl,

  initialize: function () {
    this.$el.html(this.template());
  },

  logout: function () {
    sessionStorage.removeItem("User.token");
    sessionStorage.removeItem("User.login");
    Backbone.history.navigate("auth",  {trigger: true});
  }
});

export default feedList;