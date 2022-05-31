import { createApp } from 'vue'
import BootstrapVue3 from 'bootstrap-vue-3'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import App from './App.vue'



const app = createApp(App)
//app.provide('experimentalSuggestChain', window.keplr.experimentalSuggestChain)
app.config.globalProperties.$keplr = window.keplr;
app.use(BootstrapVue3)
app.mount('#app')


