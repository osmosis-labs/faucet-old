<script setup>
import axios from "axios";

import { Secp256k1HdWallet } from "@cosmjs/amino";
import { assertIsBroadcastTxSuccess, SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import { stringToPath } from "@cosmjs/crypto";
import { usekeplrStore } from '../stores/keplr'
import { useFaucetStore } from '../stores/faucet'
import { storeToRefs } from 'pinia'

const {form, wallet, queue, alert } = storeToRefs(useFaucetStore())
const {isNetworkAdded, chainId, rpcEndpoint, address,resultTx } = storeToRefs(usekeplrStore())
</script>

<template>

  <div class="container" id="app">
    <div class="row justify-content-center mt-5">
      <div class="col-lg-10 col-md-12 col-sm-12">
        <div class="row">
          <div class="col-lg-12 col-md-12 col-sm-12">
            <div class="card shadow">
              <div >
                <h4 class="p-3" >{{form.formName}}</h4>
              </div>
              <div class="card-body">
                <form>
                  <div class="mb-4">
                    <b-input-group class="mt-3 animate__animated " prepend="Osmosis Address" v-bind:class = "(form.payload.animate)?'animate__pulse':''">

                      <b-form-input  v-model="form.payload.address" ></b-form-input>
                      <b-input-group-append>
                        <b-button variant="info" @click="copy(form.payload.address)">Copy</b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </div>
                  <div class="d-grid">
                    <input class="form-control btn btn-info" type="submit" @click.prevent="submit" value="Get Tokens"/>
                  </div>
                </form>
              </div>
            </div>
            <b-alert v-model="alert.faucet.show"  dismissible >
              {{alert.faucet.message}}
            </b-alert>
          </div>


          <div class="row justify-content-center mt-5">
            <div>
              <b-tabs content-class="mt-3">
                <b-tab title="Queue" active>
                  <b-card>
                  <div v-if="queue.list[0]">
                    <b-list-group v-for="q in queue.list">
                      <b-list-group-item class="bg-transparent">{{q}}</b-list-group-item>
                    </b-list-group>
                  </div>
                  <div v-else>
                    Queue is currently empty.
                  </div>

                    <b-spinner v-if="queue.loading"></b-spinner>

                  <input class="form-control btn btn-info" type="submit" @click.prevent="getQueue()" value="Refresh"/>
                  </b-card>
                </b-tab>
                <b-tab title="What's this?">
                  <b-card>
                    <p>
                      <h4>What is a the Osmosis testnet faucet?</h4>
                      <p>The Osmosis faucet distributes small amounts of OSMO to developers who are interacting with the testnet. These tokens don't have any real value as they are part of the testing network only.</p>
                    <a href="https://docs.osmosis.zone/developing/network/public-endpoints.html#official-endpoints"> Network docs</a>
                    </p>
                  </b-card>
                </b-tab>
              </b-tabs>
            </div>

          </div>

        </div>

      </div>
    </div>


  </div>
</template>

<script>
  export default {
    name: 'Faucet',
    data() { return {

    }
    },
    mounted(){
        this.getQueue()


    },
    methods: {
        submit() {
            axios.post(this.form.endpoint+"/request", {
              address: this.form.payload.address,
            })
                    .then(response => {
                      console.log(response);
                      this.alert.faucet.status = response.data.status;
                      this.alert.faucet.message = response.data.message;
                      this.alert.faucet.show = true;
                      this.form.payload.animate = false;
                      this.getQueue()
                    })
                    .catch(error => {
                      console.log(error);
                      this.alert.faucet.status = "error"
                      this.alert.faucet.message = error;
                      this.alert.faucet.show = true;
                    });



      },
      getQueue() {
        this.queue.loading = true;
        axios.get(this.form.endpoint+"/queue")
                .then(response => {
                  console.log(response);
                  this.queue.list = response.data;
                  this.queue.loading = false;
                })
                .catch(error => {
                  console.log(error);
                });



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
