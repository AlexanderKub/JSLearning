import {Collection} from "backbone";
import User from "../models/user";

export default Collection.extend({
  model : User,
  url: function() {
    return NODE_URL+"/api/userData";
  }
});