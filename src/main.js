import App from './App.vue'
import Vue from 'vue'
import router from './router'
import ECharts from 'vue-echarts'
import HelloComponent from './components/HelloWorld'
import { use } from 'echarts/core'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import firebase from 'firebase/app'
import store from "./store";
import ExpensesService from "./services/ExpensesService"
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

// Firebase configuration
var firebaseConfig = {};
if (process.env.NODE_ENV == "development") {
  firebaseConfig = {
    apiKey: "AIzaSyCkS_VQHe1wICtDNzLrBefTHFv7JxBWRv0",
    authDomain: "basic-budget-1085b.firebaseapp.com",
    projectId: "basic-budget-1085b",
    storageBucket: "basic-budget-1085b.appspot.com",
    messagingSenderId: "329374989844",
    appId: "1:329374989844:web:2c034a74fa8adb319cb101",
    measurementId: "G-HXMHB8ZK53"
  };
} else {
  firebaseConfig = {
    apiKey: "AIzaSyBpCBnXT7d9NK7FJmdg32Y_J-cX-qMBRj8",
    authDomain: "basic-budget-production.firebaseapp.com",
    projectId: "basic-budget-production",
    storageBucket: "basic-budget-production.appspot.com",
    messagingSenderId: "129639521942",
    appId: "1:129639521942:web:1da1016e25a27591ac6cb7",
    measurementId: "G-XZDJBZE0QS"
  };
}
firebase.initializeApp(firebaseConfig);
firebase.analytics();

firebase.auth().onAuthStateChanged(user => {
  store.dispatch("fetchUser", user);
  ExpensesService.getService().onLogin();
});

new Vue({
  router,
  store,
  render: h => h(App),
  mounted() {
    ExpensesService.getService().init();
  }
}).$mount('#app')
