import {Model} from "backbone";

export default Model.extend({
  defaults: {
    date: "date",
    content: "content",
    likes:0,
    reposts:0
  }
});