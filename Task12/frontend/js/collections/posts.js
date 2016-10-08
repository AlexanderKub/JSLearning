import {Collection} from "backbone";
import Post from "../models/post";

export default Collection.extend({
  model : Post,
  user: null,
  initialize: function (userID) {
    this.userID = userID;
  },
  url: function () {
    return NODE_URL+"/api/userData/" + this.userID + "/posts";
  }
});