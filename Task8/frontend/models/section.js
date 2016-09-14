import {Model} from "backbone";

export default Model.extend({
  urlRoot: "/api/sections",
  defaults: {
    name: "name",
    date: "date",
    discription:"discription"
  }
});