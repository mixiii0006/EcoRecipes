<template>
  <div class="search-view">
    <Navbar />
    <main class="main-content">
      <h2>Search Items</h2>
      <form @submit.prevent="handleSearch" class="form">
        <FormInput
          id="search"
          label="Search"
          v-model="query"
          placeholder="Enter search term"
          autocomplete="off"
        />
        <Button type="submit">Search</Button>
      </form>
      <section class="results-section" v-if="results.length > 0">
        <h3>Results</h3>
        <ul>
          <li v-for="item in results" :key="item.id">{{ item.name }}</li>
        </ul>
      </section>
      <p v-else-if="searched">No results found.</p>
    </main>
    <Footer />
  </div>
</template>

<script>
import Navbar from '../components/navbar.vue';
import Footer from '../components/footer.vue';
import FormInput from '../components/FormInput.vue';
import Button from '../components/Button.vue';
import axios from 'axios';

export default {
  name: 'SearchView',
  components: {
    Navbar,
    Footer,
    FormInput,
    Button
  },
  data() {
    return {
      query: '',
      results: [],
      searched: false
    };
  },
  methods: {
    async handleSearch() {
      if (!this.query) {
        this.results = [];
        this.searched = false;
        return;
      }
      try {
        const response = await axios.get(`http://localhost:3000/api/search?q=${encodeURIComponent(this.query)}`);
        this.results = response.data;
        this.searched = true;
      } catch (error) {
        console.error('Search failed:', error);
        this.results = [];
        this.searched = true;
      }
    }
  }
};
</script>

<style scoped>
.search-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f9f9f9;
  color: #2e7d32;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.main-content {
  flex: 1;
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(46, 125, 50, 0.2);
}

.results-section ul {
  list-style-type: none;
  padding: 0;
}

.results-section li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #ddd;
}
</style>
