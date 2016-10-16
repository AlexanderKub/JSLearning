import "../css/style.css";
import Router from "./router";
import Backbone from "backbone";

var router = new Router();
Backbone.history.start({pushState: true});