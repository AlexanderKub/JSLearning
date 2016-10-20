import {Collection} from "backbone";
import Post from "../models/post";

export default Collection.extend({
  model : Post,
  user: null,
  initialize: function (options) {
    this.userID = options.userID;
  },
  url: function () {
    console.log(this.userID);
    return NODE_URL+"/api/userData/" + this.userID + "/posts";
  }
});