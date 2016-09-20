import $ from "jquery";
import Backbone from "backbone";

import SectionItemView from "../../frontend/lib/sectionItem";
import SectionModel from "../../frontend/models/section";

QUnit.module( "About Backbone.View", {
  setup: function() {
    $("body").append("<table id='List'></table>");
    this.sectionView = new SectionItemView({ model: new SectionModel() });
  },
  teardown: function() {
    this.sectionView.remove();
    $("#List").remove();
  }
});

QUnit.test("Should be tied to a DOM element when created, based off the property provided.", function() {
  expect( 1 );
  equal( this.sectionView.el.tagName.toLowerCase(), "tr" );
});

QUnit.test("Is backed by a model instance, which provides the data.", function() {
  expect( 2 );
  notEqual( this.sectionView.model, undefined );
  equal( this.sectionView.model.get("name"), "name" );
});

QUnit.test("Can render, after which the DOM representation of the view will be visible.", function() {
  this.sectionView.render();

  $("#List").append(this.sectionView.$el);
  equal($("#List").find("tr").length, 1);
});

/*
QUnit.asyncTest( "Can wire up view methods to DOM elements." , function() {
  expect( 1 );
  var viewElt;
  this.sectionView.render();
  $("#List").append(this.sectionView.$el);

  setTimeout(function() {
    viewElt = $("#List tr").filter("first");
    equal( viewElt.length > 0, true);
    start();
  }, 1000, "Expected DOM Elt to exist");


  $("#List tr").click();
  expect( this.sectionView.model.get("done"), true );
});*/