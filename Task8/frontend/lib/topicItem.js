import {View} from "backbone";
import tmpl from "../templates/topicItem.ejs";

export default View.extend({
  tagName: "tr",
  events: {
    "click .delBtn": "deleteTopic"
  },

  initialize: function() {
    this.template = tmpl;
    this.listenTo(this.model, "change", this.render);
    this.listenTo(this.model, "destroy", this.remove);
  },

  render: function() {
    var html = this.template(this.model.toJSON());
    this.$el.html(html);
  },

  deleteTopic: function(){
    if(sessionStorage.getItem("moder")){
      this.model.idAttribute = "name";
      this.model.destroy();
    }
  }
});