import Vue from 'vue'
import VueRouter from 'vue-router'

import CustomFooter from '@/views/tables/CustomFooter'
import LocalData from '@/views/tables/LocalData'
import LocalData2 from '@/views/tables/LocalData2'
import NonPagination from '@/views/tables/NonPagination'
import RemoteData from '@/views/tables/RemoteData'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
    path: '/',
    redirect: '/remote'
  }, {
    path: '/remote',
    component: RemoteData
  }, {
    path: '/local',
    component: LocalData
  }, {
    path: '/local2',
    component: LocalData2
  }, {
    path: '/non-pagination',
    component: NonPagination
  }, {
    path: '/custom-footer',
    component: CustomFooter
  }]
})

export default router
