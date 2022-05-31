<script setup>
import { Secp256k1HdWallet } from "@cosmjs/amino";
import { assertIsBroadcastTxSuccess, SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import { stringToPath } from "@cosmjs/crypto";
</script>

<template>

  <div class="container" id="app">
    <div class="row justify-content-center mt-5">
      <div class="col-lg-8 col-md-12 col-sm-12">
        <div class="row">
          <div class="row justify-content-center mt-5">
            <div>
                  <b-card>
                    <form>
                      <div class="mb-4">
                        <b-input-group class="mt-3" prepend="Address">
                          <b-form-input  v-model="wallet.address"></b-form-input>
                          <b-input-group-append>
                            <b-button variant="info" @click="copy(wallet.address)">Copy</b-button>
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
      </div>
    </div>


  </div>
</template>

<script>
  export default {
    name: 'App',
    data() { return {
      wallet: {
        address: "No address generated",
        mnemonic: "No address generated"
      },
      alert: {
        wallet: {
          show: false,
          status: "",
          message: ""
        }
      }
    }
    },
    mounted(){
        this.createWallet()
    },
    methods: {
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
