<template>
  <nav class="navbar">
    <ul>
      <li><router-link to="/">Home</router-link></li>  <!-- Link ke Home -->
      <li><router-link to="/about">About</router-link></li>  <!-- Link ke About -->
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Navbar'
};
</script>

<style scoped>
.navbar {
  background-color: #42b883;
  padding: 1rem;
  text-align: center;
}

.navbar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.navbar li {
  display: inline;
  margin: 0 15px;
}

.navbar a {
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
}

.navbar a:hover {
  text-decoration: underline;
}
</style>
