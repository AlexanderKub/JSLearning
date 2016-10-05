import {Collection} from "backbone";
import Post from "../models/post";

export default Collection.extend({
  model : Post,
  comparator: "date",
  subs: [1, 2],
  url: function () {
    var filter = {
      "where": {
        "userId": {
          "inq": this.subs
        }
      }
    };
    return NODE_URL+"/api/posts?filter="+JSON.stringify(filter);
  }
});