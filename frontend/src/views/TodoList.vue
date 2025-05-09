<!-- src/views/TodoList.vue -->
<template>
  <div class="todo-container">
    <h1>📝 To-Do List</h1>
    <div class="form-group">
      <input v-model="input" placeholder="Tambah item..." @keyup.enter="tambahItem" />
      <button @click="tambahItem">Tambah</button>
    </div>

    <ul>
      <li v-for="item in items" :key="item.id">
        ✅ {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      input: '',
      items: []
    };
  },
  methods: {
    async fetchItems() {
      try {
        const res = await axios.get('http://localhost:3000/api/items');
        this.items = res.data;
      } catch (err) {
        console.error('Gagal ambil data:', err);
      }
    },
    async tambahItem() {
      if (!this.input.trim()) return;
      try {
        await axios.post('http://localhost:3000/api/items', { name: this.input });
        this.input = '';
        this.fetchItems();
      } catch (err) {
        console.error('Gagal menambah item:', err);
      }
    }
  },
  mounted() {
    this.fetchItems();
  }
};
</script>

<style scoped>
.todo-container {
  max-width: 500px;
  margin: 3rem auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

input {
  flex: 1;
  padding: 10px;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

button {
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 6px;
  border: none;
  background-color: #42b883;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #339966;
}

ul {
  list-style: none;
  padding: 0;
  text-align: left;
}

li {
  background-color: gray;
  padding: 10px;
  margin-bottom: 6px;
  border-radius: 6px;
  border: 1px solid #ddd;
}
</style>
