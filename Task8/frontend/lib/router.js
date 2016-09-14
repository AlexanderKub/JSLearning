import {Router} from "backbone";

export default Router.extend({
  routes: {
    "*path" : "redirectSections"
  },
  redirectSections : function(){
    this.navigate("sections", {trigger: true});
  }
});