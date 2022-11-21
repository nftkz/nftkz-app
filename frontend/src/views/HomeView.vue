<template>
  <main class="mb-auto">
    <div>
      <div class="flex flex-col items-center justify-center">
        <div class="w-full max-w-xs">
          <div class="mt-8">
            <div>
              <label class="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-500 hover:text-white">
                <img id="file-ip-1-preview" class="w-64 h-64 object-cover object-center mb-6 rounded hidden" />
                <svg class="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M17 9v2H9v8H7V11H0V9h7V1h2v8h8z" />
                </svg>
                <span class="mt-2 text-base leading-normal">Select an image</span>
                <input type='file' accept="image/*" class="hidden" @change="getImageCID" />
              </label>
            </div>
            <div>
              <input @change="generateJSON" type="text" placeholder="Name" v-model="nftName" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out mt-4">
              <textarea @change="generateJSON" type="text" placeholder="Description" v-model="nftDesc" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out mt-4"></textarea>
              <input @change="generateJSON" type="text" placeholder="Author Name" v-model="nftAuthor" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out mt-4"> 
              <input @change="generateJSON" type="text" placeholder="Twitter link" v-model="twitterLink" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out mt-4">
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

const imageCID = ref('');
const nftToken = ref('');
const nftName = ref('');
const nftDesc = ref('');
const nftAuthor = ref('');
const twitterLink = ref('');

const getImageCID = async (e) => {
  const file = e.target.files[0];
  const imagePreview = document.getElementById('file-ip-1-preview');
  imagePreview.classList.remove('hidden');
  imagePreview.src = URL.createObjectURL(file);
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
  console.log(json);
  ipfs.add(JSON.stringify(json)).then((res) => {
    nftToken.value = res.path;
  });
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
    // check if variables are not empty
    if (nftName.value == '' || nftDesc.value == '' || nftAuthor.value == '' || twitterLink.value == '' || imageCID.value == '') {
      return alert('Please fill all fields');
    }

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


</script>

<style lang="scss" scoped>

</style>