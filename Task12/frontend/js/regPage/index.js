import $ from "jquery";
import Backbone from "backbone";
import _ from "underscore";

import tmpl from "./templates/index.ejs";
import ajax from "../utils/ajax";

let authPage = Backbone.View.extend({
  events: {
    "submit .regForm": "registration",
    "click .backButton": "back"
  },

  template: tmpl,

  initialize: function () {
    this.$el.html(this.template());
  },

  registration: function (event) {
    event.preventDefault();
    var SData = {
      "login": $(".loginField").val(),
      "password": $(".passField").val()
    };
    ajax("users","POST",SData).then(
      function (response) {
        if(response.count==1) console.log("logon");
        else console.log("error");
      }
    );
  },

  back: function () {
    Backbone.history.navigate("auth",  {trigger: true});
  }
});

export default authPage;