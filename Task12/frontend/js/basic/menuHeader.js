import $ from "jquery";
import Backbone from "backbone";
import _ from "underscore";

import tmpl from "./templates/headerTemplate.ejs";

let feedList = Backbone.View.extend({
  events: {
    "click .menuButton": "showMenu"
  },

  template: tmpl,

  initialize: function (options) {
    this.$el.html(this.template({title: options.title}));
  },

  showMenu: function () {
    console.log("ShowMenu");
    $(".menu").addClass("show");
  }
});

export default feedList;