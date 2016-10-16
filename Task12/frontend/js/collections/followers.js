import {Collection} from "backbone";
import Info from "../models/userInfo";

export default Collection.extend({
  model : Info,
  comparator: "name",
  initialize: function (options) {
    this.followers = options.followers;
  },
  url: function () {
    var filter = {
      "where": {
        "id": {
          "inq": this.followers

        }
      }
    };
    return NODE_URL+"/api/userInfo?filter="+JSON.stringify(filter);
  }
});