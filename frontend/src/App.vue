<script setup>


//Telescope
//import { getSigningOsmosisClient } from 'osmojs';

import Faucet from './components/Faucet.vue'
import Keplr from './components/Keplr.vue'
import Wallet from './components/Wallet.vue'
import NotFound from './components/NotFound.vue'

import { storeToRefs } from 'pinia'
import { usekeplrStore } from './stores/keplr'
import { useFaucetStore } from './stores/faucet'

const {isNetworkAdded, chainId, rpcEndpoint, address,resultTx } = storeToRefs(usekeplrStore())
const {form, wallet, queue, alert } = storeToRefs(useFaucetStore())


</script>

<template>
  <a class="btn btn-primary" href="#/" >Faucet</a> |
  <a class="btn btn-primary" href="#/keplr">Connect Keplr</a> |
  <a class="btn btn-primary" href="#/wallet">Create Wallet</a> |
  <a class="btn btn-primary" href="#/non-existent-path">Broken Link</a>
  <component :is="currentView" />
</template>

<script>

const routes = {
  '/': Faucet,
  '/keplr': Keplr,
  '/wallet': Wallet
}


  export default {
    name: 'App',
    data() {
      return {
      currentPath: window.location.hash
      }
    },
      computed: {
          currentView() {
              return routes[this.currentPath.slice(1) || '/'] || NotFound
          }
      },
    async mounted(){
        window.addEventListener('hashchange', () => {
            this.currentPath = window.location.hash
        })

    },
    methods: {


    }
  }
</script>

<style>
@import './assets/base.css';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
body {
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('assets/bk.jpg');
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  color: #fff !important;
  font-family: 'Prompt', sans-serif !important;
  background-color: #241e45 !important;
}
.card {
  background-color: rgba(255, 255, 255, 0.3) !important;
  -webkit-backdrop-filter: blur(10px)!important;
  backdrop-filter: blur(10px)!important;
  border-radius: 5pt!important;
  border: 0px!important;
  padding: 10px!important;
  color: #fff!important;
}
.btn-info {
  background-color: rgb(50, 45, 194) !important;
  border-color: rgb(50, 45, 194) !important;

  cursor: pointer !important;
  color: white !important;
}
.btn-info:hover,.btn-info:hover,.btn-info:focus{
  background-color: rgb(40, 37, 132);
  color: white !important;

}

.nav-tabs .nav-link {
  color: white;
}
 .nav-item  {
   background: #ffffff6b;
   color: white;
 }
.list-group-item {
  color: white;
  border: none;
}
  p, p a, p a:hover {
    color: white;
  }


</style>
