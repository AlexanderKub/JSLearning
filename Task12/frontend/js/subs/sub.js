import {View} from "backbone";
import $ from "jquery";
import Backbone from "backbone";
import tmpl from "./templates/subTemplate.ejs";

export default View.extend({
  tagName: "tr",
  events: {
    "click td": "clickItem"
  },

  initialize: function() {
    this.template = tmpl;
    this.listenTo(this.model, "change", this.render);
    this.listenTo(this.model, "destroy", this.remove);
  },

  render: function() {
    var html = this.template(this.model.toJSON());
    this.$el.append(html);
  },

  clickItem: function () {
    Backbone.history.navigate("id"+this.model.id,  {trigger: true});
  }
});