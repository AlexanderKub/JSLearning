import $ from "jquery";
import Backbone from "backbone";

import TopicModel from "../../frontend/models/topic";

QUnit.module( "TopicModel");

QUnit.test("Can be created with default values.", function() {
  expect(1);
  var topic = new TopicModel();

  equal(topic.get("name"), "name" );
});

QUnit.test("Will set attributes on the model instance when created.", function() {
  expect(3);

  var topic = new TopicModel({ name: "test", date: "18-05-1995 21:40", discription: "Get change." });

  equal(topic.get("name"), "test");
  equal(topic.get("date"), "18-05-1995 21:40");
  equal(topic.get("discription"), "Get change.");
});

QUnit.test("Fires a custom event when the state changes.", function() {
  expect( 1 );

  var spy = sinon.spy();
  var topic = new TopicModel();

  topic.bind( "change", spy );
  topic.set( { name: "new text" } );

  ok(spy.calledOnce, "A change event callback was correctly triggered" );
});

QUnit.test("Can contain custom validation rules, and will trigger an error event on failed validation.", function() {
  expect(3);

  var errorCallback = sinon.spy();
  var topic = new TopicModel();

  topic.bind("invalid", errorCallback());
  topic.set({date:88},{validate:true});

  ok(errorCallback.called, "A failed validation correctly triggered an error");
  notEqual(topic.validationError, undefined);
  equal(topic.validationError, "Topic.date must be a string value.");
});