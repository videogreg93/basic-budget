<template>
  <div id="app">
    <HeaderComponent/>
    <router-view/>
  </div>
</template>

<script>
import HeaderComponent from "./components/Header";

export default {
  components: {
    HeaderComponent
  }
}
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
