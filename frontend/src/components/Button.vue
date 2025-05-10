<template>
  <button
    :type="type"
    class="btn"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    type: {
      type: String,
      default: 'button'
    }
  }
};
</script>

<style scoped>
.btn {
  background-color: #2e7d32;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 1rem;
}

.btn:hover {
  background-color: #1b5e20;
}
</style>
