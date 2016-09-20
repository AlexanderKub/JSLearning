import {Model} from "backbone";
import _ from "underscore";

export default Model.extend({
  defaults: {
    name: "name",
    date: "date",
    discription:"discription"
  },
  validate: function(attrs) {
    if (attrs.hasOwnProperty("date") && !_.isString(attrs.date)) {
      return "Topic.date must be a string value.";
    }
  }
});