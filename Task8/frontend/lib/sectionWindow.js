import $ from "jquery";
import Backbone from "backbone";
import _ from "underscore";

import tmpl from "../templates/sectionWindow.ejs";
import SectionsCollection from "../collections/sections";
import SectionsView from "./SectionItem";

let sectionList = Backbone.View.extend({
  events: {
    "click td": "navigation",
    "click #moderSpan": "moderEnter",
    "keyup #moderPass": "moderLogin",
    "click .exit": "exit"
  },

  template: tmpl,

  initialize: function () {
    this.$el.html(this.template());
    this.coll = new SectionsCollection();

    this.listenTo(this.coll, "sync", this.render);
    this.listenTo(this.coll, "create", this.render);

    this.coll.fetch();

    $(".exit").fadeIn(100);
  },

  render: function () {
    $("tbody").html("");
    const tbody = this.$("tbody");
    _.each(this.coll.models, function (model) {
      const modelView = new SectionsView({
        model: model
      });
      modelView.render();
      tbody.append(modelView.$el);
    }, this);
    if(sessionStorage.getItem("moder")){
      $(".exit").show();
      $("#moderSpan").html("Модератор");
    }else{
      $(".exit").hide();
      $("#moderSpan").html("м");
    }
  },

  navigation: function (e) {
    const section_name = $(e.target).parent().children(".name").text();
    sessionStorage.setItem("section", section_name);
    Backbone.history.navigate(section_name,  {trigger: true});
  },

  moderEnter: function () {
    if(!sessionStorage.getItem("moder")){
      let ms = $("#moderSpan");
      let mp = $("#moderPass");
      if(ms.html()=="м"){
        ms.html("Модератор");
        mp.fadeIn(100);
      }else{
        ms.html("м");
        mp.fadeOut(100);
      }
    }
  },

  moderLogin: function (e) {
    if(e.keyCode == 13){
      e.preventDefault();
      let mp = $("#moderPass");
      if(mp.val()=="1339") {
        mp.fadeOut(100);
        $(".exit").fadeIn(100);
        sessionStorage.setItem("moder",true);
      }
    }
  },

  exit: function () {
    sessionStorage.removeItem("moder");
    $("#moderSpan").html("м");
    $("#moderPass").val("");
    $(".exit").fadeOut(100);
  }

});

export default sectionList;