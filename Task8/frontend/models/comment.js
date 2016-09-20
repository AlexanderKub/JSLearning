import {Model} from "backbone";
import _ from "underscore";

export default Model.extend ({
  defaults: {
    date: "date",
    user:"user",
    text: "text"
  },
  validate: function(attrs) {
    if (attrs.hasOwnProperty("date") && !_.isString(attrs.date)) {
      return "Comment.date must be a string value.";
    }
  }
});