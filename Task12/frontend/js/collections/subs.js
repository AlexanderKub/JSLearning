import {Collection} from "backbone";
import Info from "../models/userInfo";

export default Collection.extend({
  model : Info,
  comparator: "name",
  initialize: function (options) {
    this.subs = options.subs;
  },
  url: function () {
    var filter = {
      "where": {
        "id": {
          "inq": this.subs

        }
      }
    };
    return NODE_URL+"/api/userInfo?filter="+JSON.stringify(filter);
  }
});