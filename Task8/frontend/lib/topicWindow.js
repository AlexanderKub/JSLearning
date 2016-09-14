import $ from "jquery";
import Backbone from "backbone";

import tmpl from  "../templates/topicWindow.ejs";
import tmplForm from  "../templates/topicForm.ejs";
import tmplEmpty from  "../templates/emptyList.ejs";

import TopicCollection from "../collections/topics";
import TopicView from "./topicItem";

import _ from "underscore";
import moment from "moment";
import striptags from "striptags";

let TopicList = Backbone.View.extend({

  events: {
    "click .addButton" : "addTopic",
    "click td": "navigation",
    "click .back" : "back",
    "click .exit": "exit"
  },

  template: tmpl,

  initialize: function () {
    const section =  sessionStorage.getItem("section");
    this.$el.html(this.template({section: section}));
    this.coll = new TopicCollection(section);
    this.listenTo(this.coll, "sync", this.render);
    this.listenTo(this.coll, "create", this.render);
    this.coll.fetch();
  },

  render: function () {
    $("tbody").html("");
    const tbody = this.$("tbody");
    $(".modal").hide();
    if(this.coll.models.length==0){
      tbody.append(tmplEmpty({text:"Ни одна тема ещё не созданна"}));
    }else{
      _.each(this.coll.models, function (model) {
        const modelView = new TopicView({
          model: model
        });
        modelView.render();
        tbody.append(modelView.$el);
      }, this);
    }
    if(sessionStorage.getItem("moder"))
      $(".exit").show();
    else
      $(".exit").hide();
  },

  navigation: function(e) {
    const topicName = $(e.target).parent().children(".name").text();
    if(topicName!=""){
      sessionStorage.setItem("topic", topicName);
      let sectionName = sessionStorage.getItem("section");
      Backbone.history.navigate(sectionName+"/"+topicName+"",  {trigger: true});
    }
  },

  addTopic: function() {
    let html = tmplForm({});

    let modal =  $(".modal");
    let overlay = $(".overlay");

    modal.html(html).fadeIn(100);

    $("#topicCaptcha").html(Math.round(Math.random()*1000));
	
    overlay.fadeIn(100).click(() => {
      $(".overlay").fadeOut(100);
      $(".modal").fadeOut(100);
    });

    $(".createButton").click(() => {
      let currentTime =  moment().format("DD-MM-YYYY HH:MM");
      let topicName = $("#topicName").val();
      topicName = striptags(topicName);
      topicName = $.trim(topicName);

      let topicDisc = $("#topicDisc").val();
      topicDisc = striptags(topicDisc);
      topicDisc = $.trim(topicDisc);

      let captcha = $(".captchaField").val();
      captcha = $.trim(captcha);
      let blockError = $(".blockError") ;
      let topicCaptcha = $("#topicCaptcha");
      if (captcha !== topicCaptcha.html()) {
        blockError.show();
        blockError.html("Неверный код");
        blockError.fadeOut(1500);
        topicCaptcha.val("");
        return;
      }

      if (topicName === ""){
        blockError.show();
        blockError.html("Напишите название темы!");
        blockError.fadeOut(1500);
        return;
      }

      this.coll.create({name: topicName, date: currentTime, discription: topicDisc},
        {
          error: function(){
            let errorDiv = $(".errorDiv") ;
            errorDiv.show();
            errorDiv.html("Тема с таким именем уже существует!");
            errorDiv.fadeOut(1500);
          }
        });

      $(".overlay").fadeOut(100);
      $(".modal").fadeOut(100);
    });
  },

  back() {
    Backbone.history.navigate("sections", {trigger: true});
  },

  exit: function () {
    sessionStorage.removeItem("moder");
    Backbone.history.navigate("sections", {trigger: true});
  }

});

export default TopicList;