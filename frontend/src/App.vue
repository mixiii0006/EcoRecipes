<template>
  <div class="app">
    <!-- Navbar -->
    <Navbar />
    
    <!-- Main Content -->
    <TodoList />
    
    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'; // Import Navbar component
import Footer from './components/Footer.vue'; // Import Footer component
import TodoList from './views/TodoList.vue';  // Import TodoList view

export default {
  components: {
    Navbar,
    Footer,
    TodoList
  }
};
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
