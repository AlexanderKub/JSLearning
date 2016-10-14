import $ from "jquery";
import Backbone from "backbone";
import _ from "underscore";

import tmpl from "./templates/menuTemplate.ejs";

let feedList = Backbone.View.extend({
  events: {
    "click .menuContent": "show"
  },

  template: tmpl,

  initialize: function () {
    this.$el.html(this.template());
  }

});

export default feedList;