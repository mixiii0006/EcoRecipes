import { createRouter, createWebHistory } from 'vue-router';

import LandingPage from '../views/LandingPage.vue';
import HomeView from '../views/homeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import SearchView from '../views/SearchView.vue';
import ProfileView from '../views/profileView.vue';

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
    component: ProfileView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
