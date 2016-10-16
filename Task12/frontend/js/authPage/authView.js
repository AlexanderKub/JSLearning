import $ from "jquery";
import _ from "underscore";
import Backbone from "backbone";

import tmpl from "./templates/authFormTemplate.ejs";
import usersData from "../utils/usersData";
import validation from "../utils/validation";
import BasicHeader from "../basic/basicHeader";
import BasicFooter from "../basic/basicFooter";

let authPage = Backbone.View.extend({
  events: {
    "submit .authForm": "authorize",
    "click .regButton": "registrationForm"
  },

  template: tmpl,
  initialize: function (options) {
    this.optionFlag = options;
    this.header = new BasicHeader({el: $("header")});
    this.footer = new BasicFooter({el: $("footer")});
    this.render();
  },

  render: function () {
    this.$el.html(this.template());
    var form = this.$el.find(".styledForm");
    form.css("left",(parseFloat($("html").css("width"))-parseFloat(form.css("width"))-parseFloat(form.css("padding"))*2)*0.5);
    if(this.optionFlag.state=="ok"){
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
  },

  close: function () {
    this.header.undelegateEvents();
    this.header.$el.empty();
    this.footer.undelegateEvents();
    this.footer.$el.empty();
  }
});

export default authPage;