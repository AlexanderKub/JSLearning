import {Collection} from "backbone";
import Post from "../models/post";

export default Collection.extend({
  model : Post,
  user: null,
  initialize: function (userID) {
    this.userID = userID;
  },
  url: function () {
    return "!host/api/users/" + this.userID + "/posts";
  }
});