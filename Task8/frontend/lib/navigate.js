import Sections from "./sectionWindow";
import Topics from "./topicWindow";
import Comments from "./commentWindow";

import {Router} from "backbone";
import $ from "jquery";

import tmpl from "../templates/index.ejs";
$("#page").html(tmpl({}));

export default Router.extend({
  routes: {
    "sections": "navigateSections",
    ":section": "navigateTopics",
    ":section/:topic": "navigateComments"
  },

  oldView : null,

  $el: $(".content"),

  closeOld: function(){
    this.oldView.remove();
  },

  navigateSections: function(){
    if (this.oldView) this.closeOld();
    $("#page").append(this.$el);
    this.oldView = new Sections({el : this.$el});
  },

  navigateTopics: function(){
    if (this.oldView) this.closeOld();
    $("#page").append(this.$el);
    this.oldView = new Topics({el : this.$el});
  },

  navigateComments: function(){
    if (this.oldView) this.closeOld();
    $("#page").append(this.$el);
    this.oldView = new Comments({el : this.$el});
  }
});