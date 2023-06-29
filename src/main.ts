import { createApp } from 'vue'
import 'virtual:svg-icons-register'
import gloablComponent from './components/index'
import App from './App.vue'
import router from './router'
import pinia from './store'
import './permission'
import '@/styles/index.scss'
import { usePlugins } from './plugins.ts'
import { extendPiniaReset } from './piniaExtensions.ts'
import 'element-plus/theme-chalk/dark/css-vars.css'
import { isHasButton } from '@/directives/has.ts'
const app = createApp(App)
usePlugins(app)
extendPiniaReset(pinia)
app.use(isHasButton)
app.use(pinia)
app.use(router)
app.use(gloablComponent)
app.mount('#app')
