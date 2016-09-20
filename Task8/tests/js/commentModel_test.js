import $ from "jquery";
import Backbone from "backbone";

import CommentModel from "../../frontend/models/comment";

QUnit.module( "CommentModel");

QUnit.test("Can be created with default values.", function() {
  expect(1);
  var comment = new CommentModel();

  equal(comment.get("text"), "text" );
});

QUnit.test("Will set attributes on the model instance when created.", function() {
  expect(3);

  var comment = new CommentModel({ user: "test", date: "18-05-1995 21:40", text: "Get change." });

  equal(comment.get("user"), "test");
  equal(comment.get("date"), "18-05-1995 21:40");
  equal(comment.get("text"), "Get change.");
});

QUnit.test("Fires a custom event when the state changes.", function() {
  expect( 1 );

  var spy = sinon.spy();
  var comment = new CommentModel();

  comment.bind( "change", spy );
  comment.set( { text: "new text" } );

  ok(spy.calledOnce, "A change event callback was correctly triggered" );
});

QUnit.test("Can contain custom validation rules, and will trigger an error event on failed validation.", function() {
  expect(3);

  var errorCallback = sinon.spy();
  var comment = new CommentModel();

  comment.bind("invalid", errorCallback());
  comment.set({date:88},{validate:true});

  ok(errorCallback.called, "A failed validation correctly triggered an error");
  notEqual(comment.validationError, undefined);
  equal(comment.validationError, "Comment.date must be a string value.");
});