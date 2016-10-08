import $ from "jquery";
import Backbone from "backbone";
import _ from "underscore";

import tmpl from "./templates/index.ejs";
import usersData from "../utils/usersData";
import validation from "../utils/validation";
let authPage = Backbone.View.extend({
  events: {
    "submit .authForm": "authorize",
    "click .regButton": "registrationForm"
  },

  template: tmpl,

  initialize: function (options) {
    this.$el.html(this.template());
    if(options.state=="ok"){
      var message = this.$el.find(".warning");
      message.removeClass("warning");
      message.addClass("message");
      message.html("Успешная регистрация");
    }
    var el = this.$el;
    _.delay(function(){
      el.find(".styledForm").addClass("showForm");
    },0);
  },

  authorize: function (event) {
    event.preventDefault();
    var login = $(".loginField").val();
    var password = $(".passField").val();

    if(!validation.check("login",login)){
      this.warning(validation.warningText("login"));
      return;
    }

    if(!validation.check("pass",password)){
      this.warning(validation.warningText("pass"));
      return;
    }

    var view = this;
    usersData.AuthUser(login,password).then(
      function (response) {
        if(!response) {
          view.warning("Неверный логин или пароль");
          return;
        }
        Backbone.history.navigate("feeds",  {trigger: true});
      }
    );
  },

  registrationForm: function () {
    Backbone.history.navigate("registration",  {trigger: true});
  },

  warning: function (text) {
    var message = this.$el.find(".warning");
    if(message.length == 0){
      message = this.$el.find(".message");
      message.removeClass("message");
      message.addClass("warning");
    }
    message.html(text);
  }
});

export default authPage;