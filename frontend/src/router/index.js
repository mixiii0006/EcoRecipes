import { createRouter, createWebHistory } from 'vue-router';
import TodoList from '../views/TodoList.vue'; 


const routes = [
  {
    path: '/',
    name: 'Home',
    component: TodoList  
  },
 
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
