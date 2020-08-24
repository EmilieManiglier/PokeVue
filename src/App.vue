<template>
  <div id="app">
    <Header />
    <router-view/>
  </div>
</template>

<script>
import Header from '@/components/Header';

export default {
  name: 'Home',
  components: {
    Header
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  border: 0;
  list-style-type: none;
  text-decoration: none;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #2c3e50;
  max-width: 100vw;
  min-height: 100vh;
}
</style>
