import {Collection} from "backbone";
import Topic from "../models/topic";

export default Collection.extend({
  model : Topic,
  section: null,
  initialize: function (section) {
    this.section = section;
  },
  url: function () {
    return "/api/sections/" + this.section + "/topics";
  }
});