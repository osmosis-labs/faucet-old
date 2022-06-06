import { createApp } from 'vue'
import { createPinia } from 'pinia'
import BootstrapVue3 from 'bootstrap-vue-3'
import buffer from 'buffer'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import 'animate.css';
import App from './App.vue'
import Network from './Network.vue'
import router from './routes/index'
//import { useStorage } from "vue3-storage"


const app = createApp(App)
app.component('Network', Network)
app.use(createPinia())
app.use(router)
app.use(BootstrapVue3)
//app.use(useStorage)
app.mount('#app')


