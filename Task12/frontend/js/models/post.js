import {Model} from "backbone";

export default Model.extend({
  defaults: {
    date: "name",
    content: "date",
    likes:0,
    reposts:0
  }
});