<template>
  <div class="form-group">
    <label :for="id" class="form-label">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      class="form-input"
      @input="$emit('update:modelValue', $event.target.value)"
      :autocomplete="autocomplete"
    />
  </div>
</template>

<script>
export default {
  name: 'FormInput',
  props: {
    id: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, default: 'text' },
    placeholder: { type: String, default: '' },
    modelValue: { type: [String, Number], default: '' },
    autocomplete: { type: String, default: 'off' }
  }
};
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.form-label {
  margin-bottom: 0.25rem;
  font-weight: 600;
  color: #2e7d32; /* green accent */
  align-items: left;
}

.form-input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #2e7d32;
  box-shadow: 0 0 5px rgba(46, 125, 50, 0.5);
}
</style>
