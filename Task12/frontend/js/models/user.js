import {Model} from "backbone";

export default Model.extend({
  urlRoot: "/api/users",
  defaults: {
    login: "",
    password: "",
    subs: [],
    folowers:[]
  }
});