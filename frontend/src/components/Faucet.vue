
<template>
  <div v-if="isTestnet" >

    <div class="card light-card mb-3"  id="faucet">
      <div >
        <h4 class="p-2" >{{form.formName}}</h4>
      </div>
      <div class="card-body">

        <div class="row">
          <div class="col">
            You are currently connecting to <b> {{rpcEndpoint}}</b> on chain id <b> {{chainId}}</b>.
          </div>
        </div>

        <form>
          <div class="mb-4">
            <b-input-group class="mt-3 animate__animated " prepend="Address" v-bind:class = "(form.payload.animate)?'animate__pulse':''">

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

    <div class="mb-3"  id="keplrStore">
      <b-tabs content-class="">
      <b-tab title="Queue" active>
        <b-card class="card light-card">
          <div v-if="queue.list[0]">
            <b-list-group v-for="q in queue.list">
              <b-list-group-item class="bg-transparent">
                <router-link :to="'/account/'+address" class="link-info"> {{q}}</router-link>
              </b-list-group-item>
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
        <b-card class="card light-card">
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


  <div class="card light-card mb-3" v-else>
    <div>
      <div >
        Faucet is only available on testnet. You are currently connected to {{chainId}} mainnet.
      </div>
    </div>
  </div>



  <div class="row">
    <div class="col text-white">
      <h4 >Recent Transactions</h4>
    </div>
  </div>

  <div class="row">
    <div class="col text-start text-white">
      <div class="text-center"> Total transactions found: {{txs.total_count}}</div>
      <b-pagination align="fill" limit="10" v-model="txs.currentPage" pills :total-rows="txs.total_count"  :per-page="txs.per_page"  size="md" v-on:click="changePage(txs.currentPage)"></b-pagination>
    </div>
  </div>

  <div class="card light-card ">
    <table class="table text-white" style="table-layout: fixed;">
      <thead>
      <tr>
        <th scope="col">Tx Hash</th>
        <th scope="col">Events</th>
        <th scope="col">Height</th>
      </tr>
      </thead>
      <tbody>
      <tr  v-for="(txList, index) in txs.list">
        <th scope="row text-start">{{shortString(txList.hash)}}</th>
        <td class="text-start" style="overflow-wrap: break-word;">
          <!--                      <b-badge variant="success">  events</b-badge>-->



          <b-button   v-b-toggle="'coll-'+index" variant="primary">{{txList.tx_result.events.length}} events</b-button>
          <b-collapse :id="'coll-'+index" >
            <div v-for="event in txList.tx_result.events">
              <b-badge v-if="event.type == 'coin_spent' || event.type == 'coin_received'" variant="success"> {{event.type}}</b-badge>
              <b-badge v-else> {{event.type}}</b-badge>
              <div class="row">
                <div v-for="attr in event.attributes" class="col-12" >
                  <b-badge  class="ms-4" >{{decode(attr.key)}}</b-badge>  {{decode(attr.value)}}
                </div>
              </div>
            </div>
          </b-collapse>



        </td>
        <td>{{txList.height}}</td>
      </tr>
      </tbody>
    </table>
  </div>

</template>

<script>
  import axios from "axios";

  import { Secp256k1HdWallet } from "@cosmjs/amino";
  import { assertIsBroadcastTxSuccess, SigningStargateClient, StargateClient } from "@cosmjs/stargate";
  import { stringToPath } from "@cosmjs/crypto";
  import { usekeplrStore } from '../stores/keplr'
  import { useFaucetStore } from '../stores/faucet'
  import { storeToRefs } from 'pinia'
  import base64 from "base-64";

  export default {

    name: 'Faucet',
    setup(){
      const {form, wallet, queue, alert, txs } = storeToRefs(useFaucetStore())
      const {isNetworkAdded, chainId, rpcEndpoint, address,resultTx, isTestnet } = storeToRefs(usekeplrStore())

      return {
        form, wallet, queue, alert, txs,
        isNetworkAdded, chainId, rpcEndpoint, address,resultTx, isTestnet
      }
    },
    async mounted() {
      this.getQueue()
      const getTxCount = await this.getTxCount();
      const latest = await  this.latestTxs(1);
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
      async getQueue() {
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
      },
      changePage: function(pageNumber){
        this.txs.list = {};
        this.latestTxs(pageNumber);
      },
      decode: function(text){
        return base64.decode(text);
      },
      shortString: function (string) {

        let begin = string.substring(0, 8);
        let end = string.substring(string.length - 8);

        return ""+begin+"..."+end+"";
      },
      getTxCount: async function () {

        console.log("keplrStore...")
        await axios.post(this.rpcEndpoint,
                {
                  "jsonrpc": "2.0",
                  "id": 998254319713,
                  "method": "tx_search",
                  "params": {
                    "query": "tx.height>=0 AND tx.height<=9007199254740991",
                    "page": "1",
                    "order_by": "desc"
                  }
                })
                .then(response => {
                  console.log("Count");

                  this.txs.total_count = parseInt(response.data.result.total_count);
                  let pageCount = response.data.result.total_count/30;
                  this.txs.pages = Math.trunc(pageCount)+1;
                  return true;

                })
                .catch(error => {
                  console.log(error);
                  return false;
                });

        return true

      },
      latestTxs: async function (page) {

        console.log("latestTxs... page:"+page)
        let that = this;
        let pageNumber = page;

        let payload = {
          "jsonrpc": "2.0",
          "id": 998254319713,
          "method": "tx_search",
          "params": {
            "page": ""+pageNumber+"",
            // "order_by": "desc",
            // "query": "message.module='bank' AND tx.height>=0 AND tx.height<=9007199254740991",
            //"query": "message.module='bank' AND transfer.recipient='"+this.$route.params['address']+"' AND tx.height>=0 AND tx.height<=9007199254740991",
            "query": "tx.height>=0 AND tx.height<=9007199254740991",

          }
        };
        axios.post(this.rpcEndpoint,payload)
                .then(response => {
                  console.log(response)
                  this.txs.list = response.data.result.txs.reverse();
                })
                .catch(error => {
                  console.log(error);
                });



      },

    }
  }
</script>

<style>

  #faucettabs .nav-tabs {
    border-bottom: 0px solid #dee2e6;
  }
</style>
