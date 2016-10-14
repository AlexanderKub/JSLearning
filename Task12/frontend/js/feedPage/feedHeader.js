import $ from "jquery";
import Backbone from "backbone";
import _ from "underscore";

import tmpl from "./templates/headerTemplate.ejs";

let feedList = Backbone.View.extend({
  events: {
    "click .menuButton": "showMenu"
  },

  template: tmpl,

  initialize: function () {
    this.$el.html(this.template());
  },

  showMenu: function () {
    $(".menu").addClass("show");
  }
});

export default feedList;