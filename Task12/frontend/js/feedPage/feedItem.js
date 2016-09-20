import {View} from "backbone";
import tmpl from "./templates/feedItem.ejs";

export default View.extend({
  tagName: "tr",

  initialize: function() {
    this.template = tmpl;
    this.listenTo(this.model, "change", this.render);
    this.listenTo(this.model, "destroy", this.remove);
  },

  render: function() {
    console.log("render1");
    var html = this.template(this.model.toJSON());
    this.$el.append(html);
  }

});