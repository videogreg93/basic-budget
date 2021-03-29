import Vue from 'vue'
import VueRouter from 'vue-router'
import HelloComponent from '../components/HelloWorld'
import LoginView from '../views/Login'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HelloComponent
    },{
        path: '/login',
        name: 'Login',
        component: LoginView
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
});

export default router
