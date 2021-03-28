import App from './App.vue'
import Vue from 'vue'
import VueRouter from 'vue-router'
import ECharts from 'vue-echarts'
import { use } from 'echarts/core'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import ECharts modules manually to reduce bundle size

import {
  CanvasRenderer
} from 'echarts/renderers'
import {
  BarChart
} from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent
} from 'echarts/components'

Vue.config.productionTip = false

const routes = [
  { path: '/foo', component: App }
];

const router = new VueRouter({
  routes // short for `routes: routes`
});

use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent,
]);

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueRouter);

// register globally (or you can do it locally)
Vue.component('chart', ECharts)

new Vue({
  render: h => h(App),
  routes: router
}).$mount('#app')
