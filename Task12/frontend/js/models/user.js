import {Model} from "backbone";

export default Model.extend({
  urlRoot: "/api/userData",
  defaults: {
    subs: [],
    folowers:[]
  }
});