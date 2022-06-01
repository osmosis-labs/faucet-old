

<template>

  <div class="container" id="app">
    <div class="row justify-content-center mt-5">
      <div class="col-lg-10 col-md-12 col-sm-12">
        <b-card class="light-card">
          <div class="row">
            <div class="col m-3">
              Simple utility to see current contracts from the <b> {{rpcEndpoint}}</b> endpoint running <b> {{chainId}}</b>.
            </div>
          </div>
          <div class="row">
            <div class="col-lg-6" v-for="contract in contracts">
              <b-card no-body border-variant="dark" :header="'Code ID: '+contract.codeId" class="mb-3" >
                <b-card-body class="text-center">
                  <b-card-title>{{contract.label}}</b-card-title>
                  <b-card-text>
                    <div class="row">
                      <div class="col">
                        <b>Address:</b> {{contract.address}}
                      </div>
                      <div class="col">
                        <b> Creator:</b> {{contract.creator}}
                      </div>
                    </div>
                  </b-card-text>
                  <!--                  <b-button variant="primary">Go somewhere</b-button>-->
                </b-card-body>
                <template #footer>
                  <small>
                    <span v-if="contract.admin">Admin: {{contract.admin}}</span>
                    <span v-else> <b-badge variant="primary" >No admin defined</b-badge> </span>
                  </small>
                </template>
              </b-card>
            </div>
          </div>
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
  import { useContractStore } from '../stores/contract'
  import { storeToRefs } from 'pinia'

  import { CosmWasmClient } from "cosmwasm";

  export default {
    name: 'App',
    setup(){
      const {form, wallet, queue, alert } = storeToRefs(useFaucetStore())
      const {isNetworkAdded, chainId, rpcEndpoint, address,resultTx } = storeToRefs(usekeplrStore())
      const { contracts } = storeToRefs(useContractStore())

      return {
        form, wallet, queue, alert,
        isNetworkAdded, chainId, rpcEndpoint, address,resultTx,
        contracts
      }
    },
    mounted(){
       this.client()
    },
    methods: {
      client: async  function() {
        const client = await CosmWasmClient.connect(this.rpcEndpoint);
        console.log(client);

        for (let codeId = 1; codeId < 100; codeId++) {
          let formatCodeId = codeId.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
          });
          const contract = await client.getContracts(formatCodeId);
          if (contract[0]){
            const contractDetails = await this.contractDetails(contract[0]);
            this.contracts.push(contractDetails);
          }
        }
      },
      contractDetails: async function(address) {
         const client = await CosmWasmClient.connect(this.rpcEndpoint);
         const details = await client.getContract(address)
       return details;
      },

    }
  }
</script>

<style>


</style>
