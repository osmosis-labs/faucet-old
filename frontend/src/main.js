import { createApp } from 'vue'
import BootstrapVue3 from 'bootstrap-vue-3'
import buffer from 'buffer'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import 'animate.css';
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './routes/index'

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(BootstrapVue3)
app.mount('#app')


