import {Collection} from "backbone";
import Post from "../models/post";

export default Collection.extend({
  model : Post,
  comparator: "date",
  url: function () {
    return "!host/api/posts";
  }
});