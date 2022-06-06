

<template>
  <b-card class="light-card mb-3">
    <div class="row">
      <div class="col m-3">
        Enter an OSMO address to get details from it. (This is in development, more functions like TXs and more coming soon).
      </div>
    </div>
    <div class="row">
      <div >
        <b-input-group prepend="Search Address" class="mt-3">
          <b-form-input v-model="search.address"></b-form-input>
          <b-input-group-append>
            <b-button variant="info" v-on:click="searchChain()">Submit</b-button>
          </b-input-group-append>
        </b-input-group>
        <b-alert variant="warning" show v-if="search.error !== null" class="mt-3"> {{search.error}}</b-alert>
      </div>
    </div>
  </b-card>
</template>
<script>

  import { usekeplrStore } from '../stores/keplr'
  import { useFaucetStore } from '../stores/faucet'
  import { useExplorerStore } from '../stores/explorer'
  import { storeToRefs } from 'pinia'

  import { assertIsBroadcastTxSuccess, SigningStargateClient, StargateClient } from "@cosmjs/stargate";
  import { stringToPath } from "@cosmjs/crypto";
  import { CosmWasmClient } from "cosmwasm";


  export default {
    name: 'explorer',
    props: {
      account: String,
    },
    setup(){
      const {isNetworkAdded, chainId, rpcEndpoint, address,resultTx } = storeToRefs(usekeplrStore());
      const { search } = storeToRefs(useExplorerStore());

      return {
        isNetworkAdded, chainId, rpcEndpoint, address,resultTx,
        search
      }
    },
    mounted(){
      //if keplr address present, then fill in search bar.
    if (this.address){
      this.search.address = this.address
    }

    },
    methods: {
      searchChain: async  function() {
        if (this.search.address == null){
          this.search.error = "Please enter a valid OSMO address"
        }else {
          this.search.error = null;
          this.$router.push({ path: '/account/'+this.search.address  })
        }
      }
    }
  }
</script>

<style>


</style>
