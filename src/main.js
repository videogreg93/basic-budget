import App from './App.vue'
import Vue from 'vue'
import router from './router'
import ECharts from 'vue-echarts'
import HelloComponent from './components/HelloWorld'
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

use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent,
]);

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

// register globally (or you can do it locally)
Vue.component('chart', ECharts)
Vue.component('HelloWorld', HelloComponent)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
