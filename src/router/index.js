import Vue from 'vue'
import VueRouter from 'vue-router'
import HelloComponent from '../components/HelloWorld'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HelloComponent
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
});

export default router
