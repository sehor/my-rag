<script setup>
</script>

<template>
  <header>
    <h1>RAG Knowledge System</h1>
  </header>

  <main>
    <p>Welcome to the RAG knowledge system prototype.</p>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
