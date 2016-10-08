import {Collection} from "backbone";
import Post from "../models/post";

export default Collection.extend({
  model : Post,
  comparator: "date",
  initialize: function (options) {
    this.subs = options.subs;
  },
  url: function () {
    var filter = {
      "where": {
        "userDataId": {
          "inq": this.subs
        }
      }
    };
    return NODE_URL+"/api/posts?filter="+JSON.stringify(filter);
  }
});