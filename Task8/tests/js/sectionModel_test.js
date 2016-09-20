import $ from "jquery";
import Backbone from "backbone";

import SectionsModel from "../../frontend/models/section";

QUnit.module( "SectionModel");

QUnit.test("Can be created with default values.", function() {
  expect(1);
  var section = new SectionsModel();

  equal(section.get("name"), "name" );
});

QUnit.test("Will set attributes on the model instance when created.", function() {
  expect(3);

  var section = new SectionsModel({ name: "test", date: "18-05-1995 21:40", discription: "Get change." });

  equal(section.get("name"), "test");
  equal(section.get("date"), "18-05-1995 21:40");
  equal(section.get("discription"), "Get change.");
});

QUnit.test("Fires a custom event when the state changes.", function() {
  expect( 1 );

  var spy = sinon.spy();
  var section = new SectionsModel();

  section.bind( "change", spy );
  section.set( { name: "new text" } );

  ok(spy.calledOnce, "A change event callback was correctly triggered" );
});

QUnit.test("Can contain custom validation rules, and will trigger an error event on failed validation.", function() {
  expect(3);

  var errorCallback = sinon.spy();
  var section = new SectionsModel();

  section.bind("invalid", errorCallback());
  section.set({date:88},{validate:true});

  ok(errorCallback.called, "A failed validation correctly triggered an error");
  notEqual(section.validationError, undefined);
  equal(section.validationError, "Section.date must be a string value.");
});