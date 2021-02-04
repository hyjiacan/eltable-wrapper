import Vue from 'vue'
import App from './App.vue'

import ElTableWrapper from './components'
import router from '@/router'

Vue.config.productionTip = false

Vue.use(ElTableWrapper, {
  method: 'get',
  size: 10,
  incSize: 80,
  autoHeight: false,
  type: 'i',
  pLayout: 'sizes, prev, pager, next'
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
