import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../pages";
import Login from "../pages/login";
import Register from "../pages/register";
import Secret from "../pages/secret";


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/register",
    name: "Register",
    component: Register
  },
  {
    path: "/secret",
    name: "Secret",
    component: Secret
  },
];

const router = new VueRouter({
  routes
});

export default router;
