<template>
  <main class="mb-auto">
    <div>
      <div class="flex flex-col items-center justify-center">
        <div class="w-full max-w-xs">
          <div class="mt-8">
            <div>
              <label class="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-500 hover:text-white">
                <img id="image-preview" class="w-64 h-64 object-cover object-center mb-6 rounded hidden" />
                <svg class="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M17 9v2H9v8H7V11H0V9h7V1h2v8h8z" />
                </svg>
                <span class="mt-2 text-base leading-normal">Select an image</span>
                <input type='file' accept="image/*" class="hidden" @change="showImage" />
              </label>
            </div>
            <div>
              <input type="text" placeholder="Name" v-model="nft.title" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out mt-4">
              <textarea type="text" placeholder="Description" v-model="nft.description" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out mt-4"></textarea>
              <input type="text" placeholder="Author Name" v-model="nft.author" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out mt-4"> 
              <input type="text" placeholder="Twitter link" v-model="nft.twitter" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out mt-4">
              <button class="w-full mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="mintNFT()">Mint NFT</button>  
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import ipfs from "../utils/ipfs";
import { ref } from 'vue';
import { ethers } from 'ethers';
import { nftAddress, nftABI } from '../utils/constants';

import { useWalletStore } from '../stores/wallet';

const store = useWalletStore();

const { ethereum } = window;

const nft = ref({
  imageCID: '',
  token: '',
  title: '',
  description: '',
  author: '',
  twitter: ''
});

const showImage = (e) => {
  const file = e.target.files[0];
  if (file.type.startsWith('image/')) {
    const imagePreview = document.getElementById('image-preview');
    imagePreview.classList.remove('hidden');
    imagePreview.src = URL.createObjectURL(file);
    getImageCID(file);
  } else {
    alert('Please select an image file');
  }
};

const getImageCID = async (file) => {
  try {
    const added = await ipfs.add(file);
    nft.value.imageCID = 'ipfs://' + added.path;
  } catch (error) {
    console.log("Error getting image CID: ", error);
  }
};

const generateJSON = async () => {
  try {
    const json = {
      "name": nft.value.title,
      "description": nft.value.description,
      "image": nft.value.imageCID,
      "attributes": [
        {
          "trait_type": "Author",
          "value": nft.value.author
        },
        {
          "trait_type": "Twitter",
          "value": nft.value.twitter
        }
      ]
    };
    const added = await ipfs.add(JSON.stringify(json));
    nft.value.token = added.path;
  } catch (error) {
    console.log("Error generating JSON: ", error);
  }
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
    if (nft.value.title === '' || nft.value.description === '' || nft.value.author === '' || nft.value.twitter === '') {
      return alert('Please fill all fields');
    }
    await generateJSON();
    const addressFrom = store.$state.wallet;
    const nftContract = getNFTContract();
    const tokenURI = 'ipfs://' + nft.value.token;

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


</script>

<style lang="scss" scoped>

</style>