import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import animated from "animate.css";

// import "fullpage.js/vendors/scrolloverflow"; // Optional. When using scrollOverflow:true
// import "./fullpage.scrollHorizontally.min"; // Optional. When using fullpage extensions
// import VueFullPage from "vue-fullpage.js";

import "element-plus/lib/theme-chalk/index.css";
import installElementPlus from "./utils//element";
import "@styles/index.scss"; // global css
import { ElInfiniteScroll } from "element-plus";

import _app_directive from "@src/directive/index";
const app = createApp(App);
installElementPlus(app);

_app_directive(app);

// app.use(ElementPlus);
app.use(ElInfiniteScroll);
app.use(animated);
// app.use(VueFullPage);

app.use(store).use(router).use(i18n).mount("#app");
