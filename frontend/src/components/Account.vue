

<template>
  <div>

      <b-card
            title="Account Details"
            img-top

            class="mb-2 light-card col-6 text-start"
    >
      <b-card-text>
       <div>
         <b>Address:</b> {{account.address}}
       </div>
      </b-card-text>
    </b-card>
    <b-card
            title="Assets"
            img-top
            class="mb-2 light-card  text-start"
    >
      <b-card-text>
        <div class="row">
        <div v-for="asset in mergedAssets" class="col-4">

          <div  v-if="asset.denomDetails">
            <div class="row" style="">
              <div class="col-sm-12 m-2 mb-2 col-lg-3 " >
                <img :src="asset.denomDetails.logo_URIs.png" alt="" style="max-width: 50px;">
              </div>
              <div class="col pt-2">
                <div> {{asset.denomDetails.symbol}}</div>
                <div> {{asset.denomDetails.name}}</div>
                <div> {{asset.coin.amount}}</div>
                  <div>

                      <span v-if="asset.denomDetails.denom_units[0].aliases">{{asset.amount}}
                      <span v-if="asset.denomDetails.denom_units[0].aliases[0]"> {{asset.denomDetails.denom_units[0].aliases[0]}} </span>
                      </span>
                      <span v-else>{{asset.amount}} {{asset.denomDetails.denom_units[0].denom}}</span>
                  </div>
              </div>
            </div>
          </div>
          <div style="" v-else>
            <div class="row">
              <div class="col pt-2">
                <div> {{asset.denom}}</div>
                <div> {{asset.amount}} </div>
              </div>
            </div>
          </div>

        </div>
        </div>
      </b-card-text>
        <p class="pl-5">
            <a href="https://github.com/osmosis-labs/assetlists/tree/main/osmosis-1"> Official Osmo Asset list</a>

        </p>
    </b-card>

   <div class="row">
     <div class="col text-white">
       <h4 >Recent Transactions</h4>
     </div>
   </div>

      <div class="row">
          <div class="col text-start text-white">
              <div class="text-center"> Total transactions found: {{txs.total_count}}</div>
              <b-pagination align="fill" limit=10 v-model="txs.currentPage" pills :total-rows="txs.total_count"  :per-page="txs.per_page"  size="md" v-on:click="changePage(txs.currentPage)"></b-pagination>
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
                                      <b-badge style="margin-left: 40px;" class="ms-4" >{{decode(attr.key)}}</b-badge>  {{decode(attr.value)}}
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


    <div class="row"  v-for="txList in txs.list">
    <h4 class="text-white text-start">Transaction {{shortString(txList.hash)}} </h4>

        <div style="display: none"  img-top class="mb-2  col-md-6 col-sm-12 text-start">
        <div>
          <b-card class="light-card mb-3 text-start" style="max-height: 400px; display: block; scroll-behavior: smooth; overflow: auto;  overflow-x:hidden;">
            Block height: {{txList.height}} <br>
            <h4>Events</h4>
                    <div v-for="event in txList.tx_result.events">
                      <b-badge v-if="event.type == 'message'" variant="success"> {{event.type}}</b-badge>
                      <b-badge v-else> {{event.type}}</b-badge>
                      <div class="row">
                        <div v-for="attr in event.attributes" class="col-12" >
                          <b-badge class="ms-4" >{{decode(attr.key)}}</b-badge>  {{decode(attr.value)}}
                        </div>
                      </div>
                    </div>
          </b-card>
        </div>
      </div>
<!--      <div  img-top class="mb-2  col-md-6  col-sm-12 text-start">-->
<!--        <div>-->
<!--          <b-card class="light-card mb-3" style="max-height: 400px; display: block; scroll-behavior: smooth; overflow: auto;  overflow-x:hidden;">-->
<!--            <h4> Raw JSON </h4>-->

<!--              {{JSON.parse(JSON.stringify(tx.rawLog))}}-->

<!--          </b-card>-->
<!--        </div>-->
<!--      </div>-->


    </div>



  </div>

    <div class="row">
        <div class="col text-start text-white">
            <div class="text-center"> Total transactions found: {{txs.total_count}}</div>
            <b-pagination align="fill" limit=10 v-model="txs.currentPage" pills :total-rows="txs.total_count"  :per-page="txs.per_page"  size="md" v-on:click="changePage(txs.currentPage)"></b-pagination>
        </div>
    </div>




</template>

<script>
  import { assertIsBroadcastTxSuccess, SigningStargateClient, StargateClient } from "@cosmjs/stargate";
  import { useAccountStore } from '../stores/account'
  import { usekeplrStore } from '../stores/keplr'
  import { storeToRefs } from 'pinia'
  import axios from "axios";
  import base64 from "base-64";


  export default {
    name: 'account',
    props: {
      account: String,
    },
    setup(){
      const {isNetworkAdded, chainId, rpcEndpoint, address,resultTx } = storeToRefs(usekeplrStore())
      const { blockchainAssets, assetlist, mergedAssets, account, bank, txs } = storeToRefs(useAccountStore());

      return {
        isNetworkAdded, chainId, rpcEndpoint, address,resultTx,
        blockchainAssets, assetlist, mergedAssets, account, bank, txs
      }
    },
    async mounted(){
        await this.getAccount()
     // console.log("GET")
     // await this.getTxs();
      const keplrStore = await this.keplrStore();

      // fetch first page only
      this.getTransactions(1);

        // if(keplrStore){
        //   console.log("Fecthing ")
        //   for (let i = 0; i <= this.txs.pages; i++) {
        //     console.log("Fecthing "+i);
        //
        //   }
        // }


    },
    methods: {
        changePage: function(pageNumber){
            this.txs.list = {};
            this.getTransactions(pageNumber);
        },
        decode: function(text){
            return base64.decode(text);
        },
      keplrStore: async function () {

      console.log("keplrStore...")
        await axios.post(this.rpcEndpoint,
                {
                  "jsonrpc": "2.0",
                  "id": 998254319713,
                  "method": "tx_search",
                  "params": {
                    "query": "message.module='bank' AND transfer.sender='"+this.$route.params['address']+"' AND tx.height>=0 AND tx.height<=9007199254740991",
                    "page": "1"
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
      getTransactions: async function (page) {

        console.log("getTransactions... page:"+page)
        let that = this;
        let pageNumber = page;

        let payload = {
            "jsonrpc": "2.0",
            "id": 998254319713,
            "method": "tx_search",
            "params": {
                "page": ""+pageNumber+"",
               // "query": "message.module='bank' AND tx.height>=0 AND tx.height<=9007199254740991",
                //"query": "message.module='bank' AND transfer.recipient='"+this.$route.params['address']+"' AND tx.height>=0 AND tx.height<=9007199254740991",
                "query": "message.module='bank' AND transfer.sender='"+this.$route.params['address']+"' AND tx.height>=0 AND tx.height<=9007199254740991",
                "order_by": "desc",

            }
        };
        axios.post(this.rpcEndpoint,payload)
                .then(response => {
                    console.log(response)
                  this.txs.list = response.data.result.txs;
                })
                .catch(error => {
                  console.log(error);
                });



      },
      getAccount: async  function() {
          this.mergedAssets = [];
          await this.getAssets()
          const client = await StargateClient.connect(this.rpcEndpoint);
        this.account = await client.getAccount(this.$route.params['address']);
        const userBank = await client.getAllBalances(this.$route.params['address']);
        this.bank = userBank;``
        await Promise.all(this.bank.map(async (coin) => {
          const denomDetails = this.assetlist.find(obj => {
            return obj.base === coin.denom
          });
          if (denomDetails){
            await this.mergedAssets.push({coin,denomDetails}
            );
          }else {
            await this.mergedAssets.push(coin)
          }
         //
        }));
      },
      getTxs: async function (){
        const client = await StargateClient.connect(this.rpcEndpoint);
       // this.txs = await client.searchTx(sentFromOrTo: "");

        const  transaction = await client.searchTx({sentFromOrTo: this.$route.params['address']})

        this.txs = transaction;
        console.log("TX")
        console.log(transaction)
      },
      getAssets: async function(address) {
        axios.get("https://raw.githubusercontent.com/osmosis-labs/assetlists/main/osmosis-1/osmosis-frontier.assetlist.json")
                .then(response => {
                  this.assetlist = response.data.assets;
                })
                .catch(error => {
                  console.log(error);
                });
      },
      shortString: function (string) {

        let begin = string.substring(0, 6);
        let end = string.substring(string.length - 6);

        return ""+begin+"..."+end+"";
      }
    }
  }
</script>

<style>


</style>
