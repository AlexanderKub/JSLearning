import $ from "jquery";
import Backbone from "backbone";
import _ from "underscore";

import tmpl from "./templates/index.ejs";
import ajax from "../utils/ajax";
import usersData from "../utils/usersData";

import validation from "../utils/validation";
let authPage = Backbone.View.extend({
  events: {
    "submit .regForm": "registration",
    "click .backButton": "back"
  },

  template: tmpl,

  initialize: function () {
    this.$el.html(this.template());
    var el = this.$el;
    _.delay(function(){
      el.find(".styledForm").addClass("showForm");
    },0);
  },

  registration: function (event) {
    event.preventDefault();
    var object = {
      "login": $(".loginField").val(),
      "password": $(".passField").val()
    };

    if(object["password"]!=$(".rePassField").val()){
      this.warning("Пароли не совпадают.");
      return;
    }

    if(!validation.check("login",object["login"])){
      this.warning(validation.warningText("login"));
      return;
    }

    if(!validation.check("pass",object["password"])){
      this.warning(validation.warningText("pass"));
      return;
    }

    var view = this;
    usersData.createUser(object).then(
      function (response) {
        if(!response) {
          view.warning("Не удалось зарегистрировать пользователя.");
          return;
        }
        Backbone.history.navigate("auth/ok",  {trigger: true});
      }
    );
  },

  warning: function (text) {
    var message = this.$el.find(".warning");
    message.html(text);
  },

  back: function () {
    Backbone.history.navigate("auth",  {trigger: true});
  }
});

export default authPage;