import './assets/main.css'

import { createApp } from 'vue'
import { type Pinia, createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { ImportExtensions } from './extensions'
import { ImportStores } from './stores'


export let pinia: Pinia = createPinia()

const app = createApp(App)



pinia = ImportExtensions(pinia)
pinia = ImportStores(pinia)

app.use(pinia)
app.use(router)

app.mount('#app')