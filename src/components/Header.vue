<!-- src/components/Header.vue -->
<template>
  <header>
    <h1>{{ title }}</h1>
  </header>
</template>

<script>
export default {
  name: 'Header',
  props: {
    title: String
  }
};
</script>

<style scoped>
header {
  background-color: rgba(66, 185, 131, 0.32);
  color: white;
  padding: 10px;
  text-align: center;
}
</style>
