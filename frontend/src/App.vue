<script setup>
import axios from "axios";
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { assertIsBroadcastTxSuccess, SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import { stringToPath } from "@cosmjs/crypto";

</script>

<template>
  <div class="container" id="app">
    <div class="row justify-content-center mt-5">
      <div class="col-lg-6 col-md-6 col-sm-6">
        <div class="row">
          <div class="col-lg-12 col-md-12 col-sm-12">
            <div class="card shadow">
              <div >
                <h4 class="p-3" >{{form.formName}}</h4>
              </div>
              <div class="card-body">
                <form>
                  <div class="mb-4">
                    <label for="username" class="form-label">Osmosis Address</label>
                    <input class="form-control" type="text" v-model="form.payload.address" />
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
            <div class="col col-lg-12">
              <b-button v-b-toggle.collapse-1 variant="primary">Create Wallet</b-button>
              <b-button  variant="info" href="https://docs.osmosis.zone/developing/network/public-endpoints.html#official-endpoints" target="_blank">Network Docs</b-button>
              <b-collapse id="collapse-1" class="mt-2">
                <b-card>
                  <form>
                    <div class="mb-4">
                      <label for="address" class="form-label">address</label>
                      <input class="form-control" type="text" v-model="wallet.address" />
                    </div>
                    <div class="mb-4">
                      <label for="mnemonic" class="form-label">Mnemonic</label>
                      <input class="form-control" type="text" v-model="wallet.mnemonic" />
                    </div>
                    <div class="d-grid">
                      <input class="form-control btn btn-info" type="submit" @click.prevent="createWallet" value="Generate new wallet"/>
                    </div>
                  </form>
                </b-card>
              </b-collapse>
            </div>
          </div>

        </div>

      </div>
    </div>






    <!--    <div class="row justify-content-center mt-5">-->
    <!--    <div class="col col-lg-6">-->
    <!--    <b-button v-b-toggle.collapse-1 variant="primary">State</b-button>-->
    <!--    <b-button  variant="info" href="https://docs.osmosis.zone/developing/network/public-endpoints.html#official-endpoints" target="_blank">Network Docs</b-button>-->
    <!--        <b-collapse id="collapse-1" class="mt-2">-->
    <!--          <b-card>-->
    <!--              <pre><code> {{form}} {{alert}} </code></pre>-->
    <!--          </b-card>-->
    <!--        </b-collapse>-->
    <!--    </div>-->
    <!--    </div>-->

  </div>
</template>

<script>
  export default {
    name: 'App',
    data() { return {
      form: {
        formName: "Osmosis Testnet Faucet",
        endpoint: import.meta.env.VITE_FAUCET_SERVER,
        payload: {
          mnemonic: "",
          address: "",
        }
      },
      wallet: {
        address: "No address generated",
      },
      alert: {
       faucet: {
         show: false,
         status: "",
         message: ""
       },
        wallet: {
          show: false,
          status: "",
          message: ""
        }
      }
    }
    }
    ,
    mounted(){
      this.MnemonicWalletWithPassphrase()
    },
    methods: {
      submit() {
        axios.post(this.form.endpoint, {
          address: this.form.payload.address,
        })
                .then(response => {
                  console.log(response);
                  this.alert.faucet.status = response.data.status;
                  this.alert.faucet.message = response.data.message;
                  this.alert.faucet.show = true;
                })
                .catch(error => {
                  console.log(error);
                  this.alert.faucet.status = "error"
                  this.alert.faucet.message = error;
                  this.alert.faucet.show = true;
                });



      },

      async createWallet() {
          const wallet = await DirectSecp256k1HdWallet.generate(12,{
          prefix: "osmo",
          bip39Password: '',
          hdPaths: [stringToPath("m/44'/118'/0'/0/0")]
        });
        const [firstAccount] = await wallet.getAccounts();
        this.wallet = wallet
        this.wallet.address = firstAccount.address
        return [wallet, firstAccount.address];



        // const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {
        //       prefix: constants.prefix,
        //       bip39Password: '',
        //       hdPaths: [stringToPath(constants.HD_PATH)]
        //   });
        //   const [firstAccount] = await wallet.getAccounts();
        //   return [wallet, firstAccount.address];
      },
    }
  }
</script>

<style>
@import './assets/base.css';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
body {
  background-image: url("assets/bk.jpg");
  background-size: cover!important;
  background-attachment: fixed;
  color: #fff !important;
  font-family: 'Prompt', sans-serif !important;
  background-color: #241e45 !important;
}
.card {
  background-color: rgba(255, 255, 255, 0.3) !important;
  -webkit-backdrop-filter: blur(10px)!important;
  backdrop-filter: blur(10px)!important;
  border-radius: 5pt!important;
  border: 0px!important;
  padding: 10px!important;
  color: #fff!important;
}
.btn-info {
  background-color: rgb(50, 45, 194) !important;
  border: none !important;
  cursor: pointer !important;
  color: white !important;
}
.btn-info:hover,.btn-info:hover,.btn-info:focus{
  background-color: rgb(40, 37, 132);
  color: white !important;
  border: none !important;
}

.alert-dismissible .close {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  padding: 0.75rem 1.25rem;
  color: inherit;
  border: none;
  background: none;
}
.close {
  float: right;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  color: #000;
  text-shadow: 0 1px 0 #fff;
  opacity: .5;
}
</style>
