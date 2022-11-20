<template>
  <main>
    <div>
      <div class="flex flex-col items-center justify-center">
        <h1 class="text-8xl mb-7">NFTKZ</h1>
        <div class="text-lg text-blue-800">
          {{ store.$state.wallet }}
        </div>
        <div v-if="store.$state.status == 'connected'">
          Successfully connected to Metamask
        </div>
        <div v-if="store.$state.status == 'not connected'">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="connectWallet()">Connect to MetaMask</button>
        </div>
        <div v-if="store.$state.error">
          {{ store.$state.error }}
        </div>
        <div class="w-full max-w-xs">
          <div class="flex flex-col">
            <label for="to" class="hidden">To</label>
            <input placeholder="address" type="text" id="to" v-model="to" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out mt-4" />
          </div>
          <div class="flex flex-col">
            <label for="amount" class="hidden">Amount</label>
            <input placeholder="amount" type="text" id="amount" v-model="amount" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out mt-4" />
          </div>
          <div>
            <button class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="sendTransaction()">Send Transaction</button>
          </div>
          <div>
            {{ transactionStatus }}
          </div>
          <div class="mt-8">
            <input placeholder="NFT address (ipfs)" type="text" id="nfttoken" v-model="nftToken" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out mt-4" />
            <button class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="mintNFT()">Mint NFT</button>  
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { ethers } from 'ethers';
import { contractABI, contractAddress, nftAddress, nftABI } from '../utils/constants';

import { useWalletStore } from '../stores/wallet';

const store = useWalletStore();

const { ethereum } = window;

const transactionStatus = ref('');

const to = ref('');
const amount = ref('');
const nftToken = ref('');

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

const getTransactionContract = () => {
	const provider = new ethers.providers.Web3Provider(ethereum);
	const signer = provider.getSigner();
	const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

	return transactionContract;
}

const getNFTContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const nftContract = new ethers.Contract(nftAddress, nftABI, signer);

  return nftContract;
}

const mintNFT = async () => {
  try {
    if (!ethereum) return alert('Get MetaMask!');
    if (nftToken.value === '') return alert('Enter NFT token');

    const addressFrom = store.$state.wallet;
    const nftContract = getNFTContract();
    const tokenURI = 'ipfs://' + nftToken.value;

    await ethereum.request({ 
      method: 'eth_requestAccounts',
      params: [{
        from: addressFrom,
        to: nftAddress,
        gas: 500000
      }]
    });

    const transaction = await nftContract.mintNFT(addressFrom, tokenURI);

    await transaction.wait();

  } catch (error) {
    console.log('Error: ', error);
  } 

  
}

const sendTransaction = async () => {
		try {
			if (!ethereum) return alert("Please install metamask");
      if (to.value === '' || amount.value === '') return alert("Please enter to and amount");

      const addressTo = to.value;
      const parsedAmount = ethers.utils.parseEther(amount.value);

			const transactionContract = getTransactionContract();
			await ethereum.request({
				method: "eth_sendTransaction",
				params: [{
					from: store.$state.wallet,
					to: addressTo,
					gas: "0x5208", // 21000 GWEI
					value: parsedAmount._hex // 0.1 ETH
				}],
			});

			const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, 'message', 'keyword');

			transactionStatus.value = "Pending...";
			await transactionHash.wait();
			transactionStatus.value = "Success!";
		} catch (error) {
			console.log(error);
			throw new Error("No ethereum object.");
		} finally {
      to.value = '';
      amount.value = '';
    }
	}


</script>

<style lang="scss" scoped>

</style>