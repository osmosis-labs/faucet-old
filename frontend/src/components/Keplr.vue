
<template>
    <b-card class="light-card  mb-3">
        <div class="row">
            <div class="col">
                <div v-if="isKeplrInstalled">
                    <b-alert variant="success" show>✅ Keplr is installed</b-alert>
                </div>
                <div v-else>
                    <b-alert variant="warning" show> Keplr is not installed. Click here to install it.</b-alert>
                </div>
            </div>
            <div class="col">
                <div v-if="isNetworkAdded == false">
                    <b-alert variant="warning" show> Network <b> {{chainId}}</b> missing <button v-on:click="addNetwork" class="btn btn-primary"> Add it</button> </b-alert>
                </div>
                <div v-else>
                    <b-alert variant="success" show>✅ {{chainId}} added</b-alert>
                </div>
            </div>
        </div>


        <b-input-group prepend="Address" class="mt-3">
            <b-form-input v-model="address" readonly></b-form-input>
            <b-input-group-append>
                <b-button variant="warning" v-if="isConnected" v-on:click="disconnectKeplr">Disconnect</b-button>
                <b-button variant="info" v-else  v-on:click="connectKeplr">Connect</b-button>
                <b-button variant="info" v-if="isConnected"  v-on:click="getTokens">Get Tokens</b-button>
            </b-input-group-append>
        </b-input-group>


        <div class="row justify-content-start align-items-start" v-if="isConnected">
            <div class="col-auto mt-4 ">
                <router-link  :to="'/account/'+address" >
                    <b-button variant="info">Account Details</b-button>
                </router-link>
            </div>
        </div>



    </b-card>

</template>

<script>

    import axios from "axios";
    import { Secp256k1HdWallet } from "@cosmjs/amino";
    import { assertIsBroadcastTxSuccess, SigningStargateClient, StargateClient } from "@cosmjs/stargate";
    import { stringToPath } from "@cosmjs/crypto";

    import { storeToRefs } from 'pinia'
    import { usekeplrStore } from '../stores/keplr'
    import { useFaucetStore } from '../stores/faucet'

    export default {
        name: 'keplrStart',
        setup(){
            const {form, wallet, queue, alert } = storeToRefs(useFaucetStore())
            const {isNetworkAdded, chainId, rpcEndpoint, address,resultTx } = storeToRefs(usekeplrStore())

            return {
                form, wallet, queue, alert,
                isNetworkAdded, chainId, rpcEndpoint, address,resultTx
            }
        },
        methods: {
            addNetwork: async function() {

            if (window.keplr.experimentalSuggestChain) {
                console.log("experimentalSuggestChain")
                try {
                    await window.keplr.experimentalSuggestChain({
                        chainId: this.chainId,
                        chainName: "Osmosis Testnet V13 rc3",
                        rpc: "https://rpc-v13-devnet.osmosis.zone",
                        rest: "https://lcd-v13-devnet.osmosis.zone",
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
                    const offlineSigner = window.getOfflineSigner(this.chainId);
                    const accounts = await offlineSigner.getAccounts();
                    this.address = accounts[0].address

             },
             disconnectKeplr: async function() {
                 this.address = null;
             },
            getTokens: async  function() {
                this.form.payload.address = this.address;
                window.location = '#/'
                this.form.payload.animate = true;

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
                   this.isNetworkAdded = true;
                }catch(e) {
                     console.log(e)
                    this.isNetworkAdded = false;
                }
        },
    }
</script>
