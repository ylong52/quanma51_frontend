import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes/index.js'
import VueToast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const router = createRouter({
  history: createWebHistory(),
  routes
})

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(VueToast)
app.use(ElementPlus)
app.mount('#app')