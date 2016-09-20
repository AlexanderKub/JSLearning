import Feeds from "./feedPage";

import {Router} from "backbone";
import $ from "jquery";

import tmpl from "./index.ejs";
$("#page").html(tmpl({}));

export default Router.extend({
  routes: {
    "feeds": "navigateFeeds",
    "*path" : "redirectSections"
  },

  oldView : null,

  $el: $(".content"),

  closeOld: function(){
    this.oldView.remove();
  },
  
  redirectSections : function(){
    this.navigate("feeds", {trigger: true});
  },

  navigateFeeds: function(){
    if (this.oldView) this.closeOld();
    $("#page").append(this.$el);
    this.oldView = new Feeds({el : this.$el});
  }
});