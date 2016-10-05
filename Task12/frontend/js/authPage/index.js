import $ from "jquery";
import Backbone from "backbone";
import _ from "underscore";

import tmpl from "./templates/index.ejs";
import usersData from "../utils/usersData";

let authPage = Backbone.View.extend({
  events: {
    "submit .authForm": "authorize",
    "click .regButton": "registrationForm"
  },

  template: tmpl,

  initialize: function () {
    this.$el.html(this.template());
  },

  authorize: function (event) {
    event.preventDefault();
    var login = $(".loginField").val();
    var password = $(".passField").val();

    usersData.AuthUser(login,password).then(
      function (response) {
        if(!response) {
          console.log("error");
          return;
        }
        Backbone.history.navigate("feeds",  {trigger: true});
      }
    );
  },

  registrationForm: function () {
    Backbone.history.navigate("registration",  {trigger: true});
  }
});

export default authPage;