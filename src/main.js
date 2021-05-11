import 'element-ui/lib/theme-chalk/index.css';
import Vue from 'vue'
import App from './App.vue'
import router from "./router/index";
import Bus from "./assets/js/tool/bus"
import ElementUI, { Loading } from 'element-ui';

import drag from "./assets/js/tool/drag";
import $ from 'jquery'
import Vuex from 'vuex'
import store from './store/index.js'
import * as Echarts from 'echarts';
// import 'amfe-flexible'
import "@/assets/js/tool/rem.js";

var Cesium = require('cesium/Cesium'); 
var widgets = require('cesium/Widgets/widgets.css');



window.$ = $;
window.Loading = Loading;

Vue.prototype.Cesium = Cesium
Vue.prototype.widgets = widgets

Vue.config.productionTip = false
Vue.prototype.$bus = Bus;
Vue.prototype.$echarts = Echarts;

Vue.use(ElementUI, { size: 'small', zIndex: 30000 });
Vue.use(Vuex);
// Vue.use(Echarts);

// Vue.use(heatmap);

Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0OTcwMjNhMy00YjM0LTRiZDEtYTg4OC0yN2MzYzE4OTc0N2QiLCJpZCI6MzkzNjMsImlhdCI6MTYwNzQ5NDY0OX0.Exc3GIhxfnLy36_cHEczqrT-ZeBcvf6Kxk4p9Qj5zv0";


// 避免跳转统一路由报错
import Router from 'vue-router'
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app')