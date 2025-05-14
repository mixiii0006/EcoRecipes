<template>
  <footer class="footer">
    <h1 class="logo-text">EcoRecipes</h1>
    <p>© 2025 EcoRecipes. All rights reserved.</p>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
};
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, #235f3a, #73b06f);
  color: white;
  padding: 1rem 2rem;
  padding-right: 40px;
  text-align: right;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 0.9rem;
}
.logo-text {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  margin-left: 10px;
}

@media (max-width: 768px) {
  .footer {
    font-size: 10px;
  }
}
</style>
