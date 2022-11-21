<template>
  
  <!-- tailwind header styled -->
  <header class="bg-white shadow">
    <div class="container m-auto">
      <div class="flex justify-between">
        <div class="flex">
          <div>
            <router-link to="/" class="flex items-center py-4 px-2 text-xl font-black">
              NFTKZ
            </router-link>
          </div>
        </div>
        <div class="flex items-center">
          <div v-if="store.$state.status == 'connected'" class="text-lg text-orange-600">
            Account {{ store.getShortWallet }}
          </div>
          <div v-if="store.$state.status == 'not connected'">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="connectWallet()">Connect to MetaMask</button>
          </div>
          <div v-if="store.$state.error">
            {{ store.$state.error }}
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useWalletStore } from '../stores/wallet';
import { onMounted } from 'vue';

const store = useWalletStore();

const connectWallet = () => {
  if (!ethereum) {
    alert('Get MetaMask!');
  } else {
    store.connectWallet(ethereum);
  }
};

onMounted(() => {
  store.checkIfWalletIsConnected();
});

</script>

<style lang="scss" scoped>

</style>