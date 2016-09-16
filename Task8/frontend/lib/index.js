import "../css/style.css";
import "../css/quill.snow.css";
import IndexRouter from "./router";
import  ForumRouter from "./navigate";

new IndexRouter();
new ForumRouter();

import Backbone from "backbone";
Backbone.history.start({pushState: true});