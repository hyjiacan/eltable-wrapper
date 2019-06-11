import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import ElTableWrapper from './components'

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.use(ElTableWrapper, {
  method: 'get',
  size: 10,
  incSize: 80,
  autoHeight: false,
  type: 'i',
  pLayout: 'sizes, prev, pager, next'
})

new Vue({
  render: h => h(App)
}).$mount('#app')
