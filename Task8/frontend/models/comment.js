import {Model} from "backbone";

export default Model.extend ({
  defaults: {
    date: "date",
    user:"user",
    text: "text"
  }
});