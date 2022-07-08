

<template>
    <b-card class="light-card  mb-3">
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
</template>

<script>

  import { usekeplrStore } from '../../stores/keplr'
  import { useFaucetStore } from '../../stores/faucet'
  import { useContractStore } from '../../stores/contract'
  import { storeToRefs } from 'pinia'

  import { CosmWasmClient } from "cosmwasm";

  export default {
    name: 'contracts',
    setup(){
      const {form, wallet, queue, alert } = storeToRefs(useFaucetStore());
      const {isNetworkAdded, chainId, rpcEndpoint, address,resultTx } = storeToRefs(usekeplrStore());
      const { contracts } = storeToRefs(useContractStore());

      return {
        form, wallet, queue, alert,
        isNetworkAdded, chainId, rpcEndpoint, address,resultTx,
        contracts
      }
    },
    mounted(){
       this.getContracts()
    },
    methods: {
      getContracts: async  function() {
        const client = await CosmWasmClient.connect(this.rpcEndpoint);
        console.log(client);

        for (let codeId = 1; codeId < 1000; codeId++) {
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
         const details = await client.getContract(address);
        return details;
      },

    }
  }
</script>

<style>


</style>
