import {Collection} from "backbone";
import Comment from "../models/comment";

export default Collection.extend({
  model : Comment,
  topic: null,
  initialize: function (topic) {
    this.topic = topic;
  },
  url: function () {
    return NODE_URL+"/api/topics/" + this.topic +"/comments";
  }
});