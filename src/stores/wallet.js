import { defineStore } from 'pinia'

export const useWalletStore = defineStore({
  id: 'wallet',
  state: () => ({
    wallet: null,
    status: false,
    loading: false,
    error: null,
  }),
  getters: {
    getWallet: (state) => state.wallet,
    isConnected: (state) => state.connected,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },
  actions: {
    async connectWallet(ethereum) {
      this.loading = true
      try {
        if (!ethereum) return this.error = 'No ethereum provider found'
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    
        this.wallet = accounts[0]
        if (this.wallet) {
          this.status = 'connected'
          this.loading = false
          this.error = null
        } else {
          this.loading = false
          this.error = 'No wallet found'
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async checkIfWalletIsConnected() {
      const { ethereum } = window
      if (!ethereum) return this.error = 'No ethereum provider found'
    
      const accounts = await ethereum.request({ method: 'eth_accounts' })
      if (accounts.length !== 0) {
        this.wallet = accounts[0]
        this.status = 'connected'
      } else {
        this.connected = false
        this.status = 'not connected'
      }
    }
  }
})
