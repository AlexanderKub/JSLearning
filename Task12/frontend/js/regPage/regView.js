import $ from "jquery";
import _ from "underscore";
import Backbone from "backbone";

import tmpl from "./templates/regFormTemplate.ejs";
import ajax from "../utils/ajax";
import usersData from "../utils/usersData";
import BasicHeader from "../basic/basicHeader";
import BasicFooter from "../basic/basicFooter";

import validation from "../utils/validation";
let authPage = Backbone.View.extend({
  events: {
    "submit .regForm": "registration",
    "click .backButton": "back"
  },

  template: tmpl,

  initialize: function () {

  },

  render: function () {
    this.header = new BasicHeader({el: $("header")});
    this.footer = new BasicFooter({el: $("footer")});
    this.$el.html(this.template());
    var form = this.$el.find(".styledForm");
    form.css("left",(parseFloat($("html").css("width"))-parseFloat(form.css("width"))-parseFloat(form.css("padding"))*2)*0.5);
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