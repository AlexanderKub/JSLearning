import "../css/style.css";
import Router from "./router";

new Router();

import Backbone from "backbone";
Backbone.history.start({pushState: true});