import { createRouter, createWebHistory } from 'vue-router';


import LandingPage from '../views/LandingPage.vue';
import HomeView from '../views/homeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import SearchView from '../views/SearchView.vue';
import ProfileView from '../views/profileView.vue';
import InputIngredients from '../views/inputView.vue';
import ScanIngredients from "../views/ScanView.vue";
import RecipeDetail from "../views/recipeView.vue";

const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage
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
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/search',
    name: 'Search',
    component: SearchView
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
  },
  {
    path:'/input-ingredients',
    name: 'InputIngredients',
    component: InputIngredients,
  },
  {
    path: "/scan-ingredients",
    name: "ScanIngredients",
    component: ScanIngredients,
  },
  {
    path: "/recipe-detail",
    name: "RecipeDetail",
    component: RecipeDetail,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard to protect routes
router.beforeEach((to, from, next) => {
  const publicPages = ['LandingPage', 'Login', 'Register'];
  const authRequired = !publicPages.includes(to.name);
  const token = localStorage.getItem('token');

  if (authRequired && !token) {
    return next({ name: 'Login' });
  }
  next();
});

export default router;
