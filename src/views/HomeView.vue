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
            <!-- <input placeholder="NFT address (ipfs)" type="text" id="nfttoken" v-model="nftToken" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out mt-4" /> -->
            <input type="file" id="nfttoken" v-on:change="getImageCID" />        
            <input type="text" placeholder="Name" v-model="nftName" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out mt-4">
            <textarea type="text" placeholder="Description" v-model="nftDesc" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out mt-4"></textarea>
            <input type="text" placeholder="Author Name" v-model="nftAuthor" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out mt-4"> 
            <input type="text" placeholder="Twitter link" v-model="twitterLink" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out mt-4">
            <!-- generate json -->
            <button class="w-full mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="generateJSON()">Generate JSON</button>
            <button class="w-full mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="mintNFT()">Mint NFT</button>  
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import ipfs from "../utils/ipfs";
import { onMounted, ref } from 'vue';
import { ethers } from 'ethers';
import { contractABI, contractAddress, nftAddress, nftABI } from '../utils/constants';

import { useWalletStore } from '../stores/wallet';

const store = useWalletStore();

const { ethereum } = window;

const transactionStatus = ref('');

const to = ref('');
const amount = ref('');
const imageCID = ref('');
const nftToken = ref('');
const nftName = ref('');
const nftDesc = ref('');
const nftAuthor = ref('');
const twitterLink = ref('');

const getImageCID = async (e) => {
  const file = e.target.files[0];
  try {
    const added = await ipfs.add(file);
    imageCID.value = 'ipfs://' + added.path;
    console.log(imageCID.value);
  } catch (error) {
    console.log("Error uploading file: ", error);
  }
};

const generateJSON = () => {
  // save clean json file
  const json = {
    "name": nftName.value,
    "description": nftDesc.value,
    "image": imageCID.value,
    "attributes": [
      {
        "trait_type": "Author",
        "value": nftAuthor.value
      },
      {
        "trait_type": "Twitter",
        "value": twitterLink.value
      }
    ]
  }
  ipfs.add(JSON.stringify(json)).then((res) => {
    nftToken.value = res.path;
    console.log(res.path);
  });
}

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