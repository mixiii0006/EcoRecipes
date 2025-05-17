import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import Navbar from './components/navbar.vue';
import Sidebar from './components/sidebar.vue'; 
import Footer from './components/footer.vue';
import RecipeModal from './components/RecipeModal.vue'; 
import RecipeCard from './components/RecipeCard.vue';


const app = createApp(App);

app.component('Navbar', Navbar);
app.component('Sidebar', Sidebar); 
app.component('Footer', Footer); 
app.component('RecipeCard', RecipeCard);
app.component('RecipeModal', RecipeModal);
app.use(router); 
app.mount('#app'); 
