import {View} from "backbone";
import tmpl from "../templates/commentItem.ejs";

export default View.extend({
  tagName: "div",
  className: "comment",

  events: {
    "click .delBtn": "deleteComment"
  },

  initialize: function() {
    this.template = tmpl;
    this.listenTo(this.model, "change", this.render);
    this.listenTo(this.model, "destroy", this.remove);
  },
  render: function() {
    let html = this.template(this.model.toJSON());
    this.$el.html(html);
  },

  deleteComment: function(){
    if(sessionStorage.getItem("moder")) {
      this.model.idAttribute = "id";
      this.model.destroy();
    }
  }
});