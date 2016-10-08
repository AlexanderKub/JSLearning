import {View} from "backbone";
import $ from "jquery";
import tmpl from "./templates/feedItem.ejs";

import postsData from "../utils/postsData";
export default View.extend({
  tagName: "tr",
  events: {
    "click .like": "like"
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

  like: function () {
    postsData.likePost(this.model.id,1).then(
      function (response) {
        $(".likeCount").html(response.toString());
      }
    );
  }
});