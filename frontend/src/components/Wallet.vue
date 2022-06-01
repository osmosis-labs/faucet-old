

<template>

  <div class="container" id="app">
    <div class="row justify-content-center mt-5">
      <div class="col-lg-10 col-md-12 col-sm-12">
        <b-card class="light-card">
          <form>
            <div class="mb-4">
              <b-input-group class="mt-3" prepend="Address">
                <b-form-input  v-model="wallet.address"></b-form-input>
                <b-input-group-append>
                  <b-button variant="info" @click="copy(wallet.address)"  style="border-radius:0px 0px 0px 0px">Copy</b-button>
                  <b-button variant="warning" v-if="wallet.address"  v-on:click="getTokens" style="border-radius: 0px 5px 5px 0px">Get Tokens</b-button>
                </b-input-group-append>
              </b-input-group>
            </div>
            <div class="mb-4">
              <b-input-group class="mt-3" prepend="mnemonic">
                <b-form-input  v-model="wallet.mnemonic"></b-form-input>
                <b-input-group-append>
                  <b-button variant="info" @click="copy(wallet.mnemonic)">Copy</b-button>
                </b-input-group-append>
              </b-input-group>
            </div>
            <div class="d-grid">
              <input class="form-control btn btn-info" type="submit" @click.prevent="createWallet" value="Generate new wallet"/>
            </div>
          </form>
        </b-card>
      </div>
    </div>


  </div>
</template>

<script>
  import { Secp256k1HdWallet } from "@cosmjs/amino";
  import { assertIsBroadcastTxSuccess, SigningStargateClient, StargateClient } from "@cosmjs/stargate";
  import { stringToPath } from "@cosmjs/crypto";

  import { usekeplrStore } from '../stores/keplr'
  import { useFaucetStore } from '../stores/faucet'
  import { storeToRefs } from 'pinia'


  export default {
    name: 'App',
    setup(){
      const {form, wallet, queue, alert } = storeToRefs(useFaucetStore())
      const {isNetworkAdded, chainId, rpcEndpoint, address,resultTx } = storeToRefs(usekeplrStore())

      return {
        form, wallet, queue, alert,
        isNetworkAdded, chainId, rpcEndpoint, address,resultTx
      }
    },
    mounted(){
        this.createWallet()
    },
    methods: {
      getTokens: async  function() {
        this.form.payload.address = this.wallet.address;
        window.location = '#/'
        this.form.payload.animate = true;

      },
      async createWallet() {
        const HD_PATH = "m/44'/118'/0'/0/0";
        const wallet = await Secp256k1HdWallet.generate(12,{
          prefix: "osmo",
          bip39Password: '',
          hdPaths:[stringToPath(HD_PATH)]
        });
        const [firstAccount] = await wallet.getAccounts();
        this.wallet = wallet
        this.wallet.address = firstAccount.address
        return [wallet, firstAccount.address];
      },
      async copy(s) {
        await navigator.clipboard.writeText(s);
      }

    }
  }
</script>

<style>


</style>
