import {Collection} from "backbone";
import Section from "../models/section";

export default Collection.extend({
  model : Section,
  url: function() {
    return "!host/api/sections";
  }
});