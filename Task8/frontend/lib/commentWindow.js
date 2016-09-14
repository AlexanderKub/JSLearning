import $ from "jquery";
import Backbone from "backbone";
import tmpl from  "../templates/commentWindow.ejs";
import CommentsCollection from "../collections/comments";
import CommentsView from "./commentItem";
import striptags from "striptags";
import moment from "moment";
import Quill from "quill";

let CommentList = Backbone.View.extend({

  events: {
    "click .back" : "back",
    "click #addButton" : "add_response",
    "click #arrow" : "arrow",
    "click .exit": "exit"
  },

  template: tmpl,

  initialize: function () {
    const topic = sessionStorage.getItem("topic");
    this.$el.html(this.template({topic: topic}));
    this.coll = new CommentsCollection(topic);

    this.listenTo(this.coll, "change", this.render);
    this.listenTo(this.coll, "sync", this.render);
    this.listenTo(this.coll, "create", this.render);

    this.coll.fetch();
	
    new Quill("#editorText",{
      placeholder: "Введите сообшение...",
      theme: "snow"
    });
	
    if (sessionStorage.getItem("moder")) {
      $(".exit").fadeIn(100);
    } else {
      $(".exit").fadeOut(100);
    }
  },

  render: function () {
    let cl = $("#commentsList");
    cl.html("");
    const comment = cl;
    const models = this.coll.models;
    for(let i = models.length-1; i >=0; i--){
      const modelView = new CommentsView({
        model: models[i]
      });
      modelView.render();
      comment.append(modelView.$el);
    }

    $("#topicCaptcha").html(Math.round(Math.random()*1000));
	
    $(window).scroll(() => {
      const st = $(window).scrollTop();
      if (st > 100) {
        $("#arrow").fadeIn("normal");
      } else {
        $("#arrow").fadeOut("normal");
      }
    });

  },

  add_response: function(){

    let userName =  $("#userName").val();
    userName = striptags(userName);
    userName = $.trim(userName);

    let comment = $(".ql-editor");
    let text = comment.html();
    text = striptags(text, ["a", "p", "br", "b", "u", "em", "li", "ol", "ul", "h1", "h2", "h3"]);
    text = $.trim(text);

    let currentDate =  moment().format("DD-MM-YYYY HH:MM");

    let captcha = $(".captchaField").val();
    captcha = $.trim(captcha);
    let blockError = $(".blockError") ;
    let topicCaptcha = $("#topicCaptcha");
    if (captcha !== topicCaptcha.html()) {
      blockError.show();
      blockError.html("Неверный код!");
      blockError.fadeOut(1500);
      topicCaptcha.val("");
      return;
    }

    if ($.trim(comment.children().html()) === "" || $.trim(comment.children().html()) === "<br>") {
      blockError.show();
      blockError.html("Пустой комментарий!");
      blockError.fadeOut(1500);
      return;
    }

    this.coll.create({user: userName,date: currentDate, text: text});
    comment.html("");
  },

  arrow: function() {
    $("body,html").animate({"scrollTop": 0}, "normal");
  },

  back: function() {
    Backbone.history.navigate("sections", {trigger: true});
  },

  exit: function () {
    sessionStorage.removeItem("moder");
    Backbone.history.navigate("sections", {trigger: true});
  }

});

export default CommentList;