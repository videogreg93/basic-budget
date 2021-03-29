import Vue from 'vue'
import VueRouter from 'vue-router'
import HelloComponent from '../components/HelloWorld'
import LoginView from '../views/Login'
import RegisterView from '../views/Register'
import HomePage from '../views/Homepage'
 import store from "../store";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage
    },
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

// Routes that do not need authentication
const authRoutes = ['Login', 'Register', 'Home']

router.beforeEach((to, from, next) => {
    const isAuth = store.getters.user.loggedIn;
    const requiresAuth = !authRoutes.includes(to.name);

    console.log(isAuth);
 
    if (requiresAuth && !isAuth) {
      const loginpath = window.location.pathname;
      next({ name: 'Login', query: { from: loginpath } });
    }
    else next();
  });

export default router
