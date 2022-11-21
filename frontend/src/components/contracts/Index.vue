

<template>
    <b-card class="light-card  mb-3">
        <div class="row">
            <div class="col m-3">
             Vote for a contract on <b> {{rpcEndpoint}}</b> endpoint running <b> {{chainId}}</b>. 
             This is useful when submitting contract via governance on the testnet and having the faucet vote for you.
            </div>
        </div>
        <div>
                    <form>
          <div class="mb-4">
            <b-input-group class="mt-3 animate__animated " prepend="Proposal ID">

            <b-form-input  v-model="form.payload.code_id"  @keypress="onlyNumber" type="number"></b-form-input>
             <!-- <b-form-select v-model="form.VoteOptionSelected" :options="form.VoteOptions"></b-form-select> -->
              <b-input-group-append>
                          <input class="form-control btn btn-info" type="submit" @click.prevent="submitVote" value="Vote"/>
              </b-input-group-append>
            </b-input-group>
          </div>
          <div class="d-grid">
          </div>
        </form>

                <router-link class="btn btn-primary mt-3" to="/contracts/list">See Contracts List</router-link> 
        </div>
    </b-card>


    <b-alert v-model="alert.vote.show"  dismissible >
      {{alert.vote.message}}
    </b-alert>
</template>

<script>
  import axios from "axios";
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
     
    },
    methods: {
    
        submitVote() {
            axios.post(this.form.endpoint+"/vote", {
              code_id: this.form.payload.code_id,
              vote: this.form.VoteOptionSelected,

            })
                    .then(response => {
                      console.log(response);
                      this.alert.vote.status = response.data.status;
                      this.alert.vote.message = response.data.message;
                      this.alert.vote.show = true;
                      this.form.payload.animate = false;
                    })
                    .catch(error => {
                      console.log(error);
                      this.alert.vote.status = "error"
                      this.alert.vote.message = error;
                      this.alert.vote.show = true;
                    });



      },
      onlyNumber ($event) {
            //console.log($event.keyCode); //keyCodes value
            let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
            if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) { // 46 is dot
                $event.preventDefault();
            }
        }
      

    }
  }
</script>

<style>


</style>
