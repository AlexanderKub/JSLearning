import $ from "jquery";
import Backbone from "backbone";

import CommentCollection from "../../frontend/collections/comments";

QUnit.module( "CommentCollection");

QUnit.test( "Can add Model instances as objects and arrays.", function() {
  expect( 3 );

  var coll = new CommentCollection();
  equal( coll.length, 0 );

  coll.add( {
    date: "date",
    user:"user",
    text: "text"
  } );
  equal( coll.length, 1 );

  coll.add([{
    date: "date",
    user:"user",
    text: "text"
  },{
    date: "date",
    user:"user",
    text: "text"
  }
  ]);

  equal( coll.length, 3 );
});

QUnit.test( "Can have a url property to define the basic url structure for all contained models.", function() {
  expect( 1 );
  var coll = new CommentCollection();
  notEqual( coll.url, "" );
});

QUnit.test("Fires custom named events when the models change.", function() {
  expect(2);

  var coll = new CommentCollection();
  var addModelCallback = sinon.spy();
  var removeModelCallback = sinon.spy();

  coll.bind( "add", addModelCallback );
  coll.bind( "remove", removeModelCallback );

  coll.add( {text:"New comment"});

  ok(addModelCallback.called);

  coll.remove(coll.last());

  ok( removeModelCallback.called );
});