import $ from "jquery";
import Backbone from "backbone";
import _ from "underscore";

import tmpl from "./templates/basicFooter.ejs";

let feedList = Backbone.View.extend({
  events: {

  },

  template: tmpl,

  initialize: function () {
    this.$el.html(this.template());
  }

});

export default feedList;