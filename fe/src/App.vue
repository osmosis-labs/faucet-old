<template>
<div class="container" id="app">
  <div class="row justify-content-center mt-5">
    <div class="col-lg-6 col-md-6 col-sm-6">
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
              <input class="form-control btn btn-info" type="submit" @click.prevent="Submit" />
            </div>
          </form>
          <div v-show="alert.show" class="alert "
                :class="alert.status == 'error' ? 'alert-warning' : 'alert-success'"
                >
                <h5 class="alert-heading text-capitalize"> {{alert.status}}</h5>
                <p class="mb-0"> {{alert.message}}</p>
          </div>
        </div>
      </div>
    </div>
    </div>
<div class="row justify-content-center mt-5">
<div class="col col-lg-6">
<b-button v-b-toggle.collapse-1 variant="primary">State</b-button>
<b-button  variant="info" href="https://docs.osmosis.zone/developing/network/public-endpoints.html#official-endpoints" target="_blank">Network Docs</b-button>
    <b-collapse id="collapse-1" class="mt-2">
      <b-card>
          <pre><code> {{form}} {{alert}} </code></pre></b-card>
      </b-card>
    </b-collapse>
</div>
</div>

</div>
</template>

<script>
import axios from "axios";
export default {
  name: 'App',
  data() { return {
form: {
          formName: "Osmosis Testnet Faucet",
          endpoint: "http://localhost/faucetRequest",
          payload: {
            address: "",
        }
      },
        alert: {
          status:"",
          show :false,
          message: ""
        }
    }
  }
      ,
      methods: {
        Submit() {
                  axios.post(this.form.endpoint, {
                    address: this.form.payload.address,
                  })
                  .then(response => {
                    console.log(response);
                    this.alert.status = response.data.status;
                    this.alert.message = response.data.message;
                    this.alert.show = true;
                  })
                  .catch(error => {
                    console.log(error);
                    this.alert.status = "error"
                    this.alert.message = error;
                    this.alert.show = true;
                  });
            setTimeout(() => {
              this.alert.show =false;
            }, 6000);
        }
    }
}
</script>

<style>
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
      background-size: cover;
      color: #fff;
      font-family: 'Prompt', sans-serif;
      background-color: #241e45;

  }
  .card {
    background-color: rgba(255, 255, 255, 0.3);
 -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border-radius: 5pt;
  border: 0px;
  padding: 10px;
color: #fff;
  }
  .button.is-primary {
    background-color: #6500d1;
  }
  .btn-info {
    background-color: rgb(50, 45, 194);
    border: none;
    cursor: pointer;
    color: white;;
  }
  .btn-info:hover,.btn-info:hover,.btn-info:focus{
    background-color: rgb(40, 37, 132);
    color: white;
    border: none;
  }
</style>
