<template>
  <footer>
    <div class="container m-auto">
      <div class="flex justify-between">
        <div class="flex">
          <div>
            <router-link to="/" class="flex items-center py-4 px-2 text-xl">
              Made by <span class="text-red-800 ml-1">Писаревские</span>
            </router-link>
          </div>
        </div>
        <div class="flex">
          <div class="text-lg flex items-center">
            {{ new Date().getFullYear() }}
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>