import Vue from 'vue'
import VueRouter from 'vue-router'
import HelloComponent from '../components/HelloWorld'
import LoginView from '../views/Login'
import RegisterView from '../views/Register'

Vue.use(VueRouter)

const routes = [
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: HelloComponent
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterView
    }
]

const router = new VueRouter({
    mode: 'history',
    routes
});

export default router
