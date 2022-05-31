import { createApp } from 'vue'
import BootstrapVue3 from 'bootstrap-vue-3'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import 'animate.css';
import App from './App.vue'
import { createPinia } from 'pinia'



const app = createApp(App)
//app.provide('experimentalSuggestChain', window.keplr.experimentalSuggestChain)
app.config.globalProperties.$keplr = window.keplr;
app.use(BootstrapVue3)
app.use(createPinia())
app.mount('#app')


