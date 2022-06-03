<script setup>
  import { createWebHistory, createRouter } from "vue-router";

//Telescope
// //import { getSigningOsmosisClient } from 'osmojs';
//
// import Faucet from './components/Faucet.vue'
// import Keplr from './components/Keplr.vue'
// import Wallet from './components/Wallet.vue'
// import Contracts from './components/Contracts.vue'
// import Explorer from './components/Explorer.vue'
// import NotFound from './components/NotFound.vue'

import { storeToRefs } from 'pinia'
import { usekeplrStore } from './stores/keplr'
import { useFaucetStore } from './stores/faucet'
import { useContractStore } from './stores/contract'
import { useExplorerStore } from './stores/explorer'

const {isNetworkAdded, chainId, rpcEndpoint, address,resultTx } = storeToRefs(usekeplrStore())
const {form, wallet, queue, alert } = storeToRefs(useFaucetStore())
const {account} = storeToRefs(useExplorerStore())


</script>

<template>
  <router-link class="btn btn-primary mt-3" to="/" >Faucet</router-link> |
  <router-link class="btn btn-primary mt-3" to="/keplr">Connect Keplr</router-link> |
  <router-link class="btn btn-primary mt-3" to="/wallet">Create Wallet</router-link> |
  <router-link class="btn btn-primary mt-3" to="/contracts">Contracts</router-link> |
  <router-link class="btn btn-primary mt-3" to="/explorer">Search</router-link> |
  <router-view />

    Change Network: <a href="#" v-on:click="selectNet('testnet')" >Tesnet</a> | <a href="#" v-on:click="selectNet('mainnet')" >Mainnet</a>
</template>

<script>

  export default {
    name: 'App',
      setup(){

          const {chainId, rpcEndpoint} = storeToRefs(usekeplrStore())

          return {
            chainId, rpcEndpoint
          }
      },
      computed: {

      },
    async mounted(){


    },
    methods: {
        selectNet: function (network) {
            if (network == "testnet"){
                this.chainId = "osmo-test-1"
                this.rpcEndpoint = "https://rpc-test.osmosis.zone"
            }else if(network == "mainnet") {
                this.chainId = "osmosis-1"
                this.rpcEndpoint = "https://rpc.osmosis.zone"
            }

        }

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
  background-color: rgba(42, 56, 162, 0.5) !important;
}
.light-card {
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
