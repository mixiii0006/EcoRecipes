<template>
  <div class="app">
    <!-- Navbar -->
    
    <!-- Main Content -->
    <router-view /> 

  </div>
</template>

<script>
import Navbar from './components/navbar.vue'; // Import Navbar component
import Footer from './components/footer.vue'; // Import Footer component

export default {
  components: {
    Navbar,
    Footer
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
