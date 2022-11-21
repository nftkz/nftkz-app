<template>
  <div class="flex flex-col h-screen justify-between">
    <Header />
    <router-view></router-view>
    <Footer />
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';


</script>

<style lang="scss" scoped>

</style>