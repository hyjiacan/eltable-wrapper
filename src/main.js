import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import ElTableWrapper from './components/ElTableWrapper'

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.use(ElTableWrapper, {
  method: 'get',
  size: 10,
  incSize: 10,
  autoHeight: false,
  disablePager: false,
  source: 'i',
  pagerOption: {
    layout: 'sizes, prev, pager, next, next, jumper'
  }
})

new Vue({
  render: h => h(App)
}).$mount('#app')
