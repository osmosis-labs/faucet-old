<script setup>
import axios from "axios";
import { Secp256k1HdWallet } from "@cosmjs/amino";
import { assertIsBroadcastTxSuccess, SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import { stringToPath } from "@cosmjs/crypto";

import { storeToRefs } from 'pinia'
import { usekeplrStore } from '../stores/keplr'

const {isNetworkAdded, chainId, rpcEndpoint, address,resultTx } = storeToRefs(usekeplrStore())


</script>
<template>
<div class="container" id="app">
    <div class="row justify-content-center mt-5">
      <div class="col-lg-8 col-md-12 col-sm-12">
        <div class="row">
          <div class="row justify-content-center">
            <div>
                  <b-card>
                      <div v-if="isKeplrInstalled">
                          <b-alert variant="success" show>✅ Keplr is installed</b-alert>
                      </div>
                      <div v-else>
                          <b-alert variant="warning" show> Keplr is not installed. Click here to install it.</b-alert>
                      </div>
                      <div v-if="isNetworkAdded == false">
                          <b-alert variant="warning" show> {{chainId}} has not been added to Keplr.<button v-on:click="addNetwork"> Add it</button> </b-alert>
                      </div>
                      <div v-else>
                         <b-alert variant="success" show>✅ {{chainId}} has been added to Keplr</b-alert>
                      </div>

                     <b-button  variant="primary">
                         <span v-if="isConnected" v-on:click="disconnectKeplr">Disconnect</span>
                         <span v-else  v-on:click="connectKeplr">Connect</span>
                     </b-button>

                      <button > {{isConnected}}</button>
                      network added {{isNetworkAdded}}
                                <p>Your address: {{ address }}</p>
                                <br />
                                <button v-on:click="sendTx">sendTx</button>

                                <br />
                                <p>{{ resultTx.transactionHash }}</p>


                        <b-input-group prepend="Address" class="mt-3">
                            <b-form-input v-model="address" readonly></b-form-input>
                            <b-input-group-append>
                            <b-button variant="warning" v-if="isConnected" v-on:click="disconnectKeplr">Disconnect</b-button>
                            <b-button variant="info" v-else  v-on:click="connectKeplr">Connect</b-button>
                            </b-input-group-append>
                        </b-input-group>
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
        name: 'keplrStart',
       data() {
           return {
            isNetworkAdded: false,
            chainId: 'osmo-test-4',
            rpcEndpoint: 'https://rpc-test.osmosis.zone',
            address: null,
            resultTx: '',
           }
        },
        methods: {
            addNetwork: async function() {

            if (window.keplr.experimentalSuggestChain) {
                console.log("experimentalSuggestChain")
                try {
                    await window.keplr.experimentalSuggestChain({
                        chainId: this.chainId,
                        chainName: "Osmosis Testnet",
                        rpc: "https://rpc-test.osmosis.zone",
                        rest: "https://lcd-test.osmosis.zone",
                        stakeCurrency: {
                            coinDenom: "OSMO",
                            coinMinimalDenom: "uosmo",
                            coinDecimals: 6,
                        },
                        bip44: {
                            coinType: 118,
                        },
                        bech32Config: {
                            bech32PrefixAccAddr: "osmo",
                            bech32PrefixAccPub: "osmopub",
                            bech32PrefixValAddr: "osmovaloper",
                            bech32PrefixValPub: "osmovaloperpub",
                            bech32PrefixConsAddr: "osmovalcons",
                            bech32PrefixConsPub: "osmovalconspub"
                        },
                        currencies: [{
                            coinDenom: "OSMO",
                            coinMinimalDenom: "uosmo",
                            coinDecimals: 6,
                        }],
                        feeCurrencies: [{
                            coinDenom: "OSMO",
                            coinMinimalDenom: "uosmo",
                            coinDecimals: 6,
                        }],
                        coinType: 118,
                        gasPriceStep: {
                            low: 0.01,
                            average: 0.025,
                            high: 0.04
                        }
                    });
                    this.isNetworkAdded = true;
                } catch(e) {
                    console.log(e)
                    alert("Failed to suggest the chain");
                }
            } else {
                alert("Please use the recent version of keplr extension");
            }

            },
            connectKeplr: async function() {
                if(!this.isNetworkAdded){
                    await this.addNetwork();
                }
                const chainEnabled =  await window.keplr.enable(this.chainId);
                   console.log("chain enabeld")
                   console.log(chainEnabled)
                    const offlineSigner = window.getOfflineSigner(this.chainId);
                    const accounts = await offlineSigner.getAccounts();
                     console.log("accounts")
                    console.log(accounts)
                    this.address = accounts[0].address

             },
             disconnectKeplr: async function() {
                 this.address = null;
             },
            sendTx: async function() {
                await window.keplr.enable(this.chainId);
                const offlineSigner = await window.getOfflineSignerAuto(this.chainId);
                const accounts = await offlineSigner.getAccounts();
                const client = await SigningStargateClient.connectWithSigner(
                    this.rpcEndpoint,
                    offlineSigner
                )
                const convertAmount = 0.01 * 1000000
                const amount = {
                    denom: 'uosmo',
                    amount: convertAmount.toString(),
                }
                const fee = {
                    amount: [{
                        denom: 'uosmo',
                        amount: '5000',
                    }, ],
                    gas: '200000',
                }
                try {
                    const result = await client.sendTokens(accounts[0].address, this.address, [amount], fee, this.memo)
                    assertIsDeliverTxSuccess(result)
                    console.log(result)
                    this.resultTx = result
                } catch (error) {
                    console.error(error);
                }
            }
        },
        computed: {
            isKeplrInstalled () {
              if (!window.getOfflineSigner || !window.keplr) {
                    return false;
                }else {
                    return true
                }
            },
            isConnected () {
              if (this.address == null) {
                    return false
                }else {
                    return true
                }
            },

      },
        async mounted () {

              try {
                   const chainEnabled =  await window.keplr.enable(this.chainId);
                   console.log("chain enabeld")
                   console.log(chainEnabled)
                   this.isNetworkAdded = true;
                }catch(e) {
                     console.log(e)
                    this.isNetworkAdded = false;
                }
        },
    }
</script>
