

<template>
  <div class="container" id="app">
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

          <div style="margin: 10px; border: 1px rgba(42,56,162,0.65) solid; border-radius: 5px;padding: 5px;" v-if="asset.denomDetails">
            <div class="row">
              <div class="col-sm-2 m-2">
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
          <div style="margin: 10px; border: 1px rgba(42,56,162,0.65) solid; border-radius: 5px;padding: 5px;" v-else>
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
  </div>

</template>

<script>
  import { assertIsBroadcastTxSuccess, SigningStargateClient, StargateClient } from "@cosmjs/stargate";
  import { useAccountStore } from '../stores/account'
  import { usekeplrStore } from '../stores/keplr'
  import { storeToRefs } from 'pinia'
  import axios from "axios";


  export default {
    name: 'account',
    props: {
      account: String,
    },
    setup(){
      const {isNetworkAdded, chainId, rpcEndpoint, address,resultTx } = storeToRefs(usekeplrStore())
      const { blockchainAssets, assetlist, mergedAssets, account, bank } = storeToRefs(useAccountStore());

      return {
        isNetworkAdded, chainId, rpcEndpoint, address,resultTx,
        blockchainAssets, assetlist, mergedAssets, account, bank
      }
    },
    async mounted(){
        await this.getAccount()
     // console.log("GET")
     // await this.getTxs();
    },
    methods: {
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

        const  transaction = await client.searchTx({sentFromOrTo: "osmo145p0kql0xxqah7xg7qkhad7vzkudxdudt7fq9v"})
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
    }
  }
</script>

<style>


</style>
