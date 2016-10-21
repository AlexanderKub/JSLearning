import "../css/style.css";
import Router from "./router";
import Backbone from "backbone";
import Scripts from "./utils/scripts";

var router = new Router();
Backbone.history.start({pushState: true});