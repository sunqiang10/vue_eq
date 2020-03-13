import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Login from '@/components/Login'
import BaiDuMap from '@/components/BaiDuMap'
import UserView from '@/components/UserView'
import ReportView from '@/components/ReportView'
import ReportEdit from '@/components/ReportEdit'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      meta:{
        requireAuth: true
      }
    },
    {
      path: '/bdmap',
      name: 'BaiDuMap',
      component: BaiDuMap,
      meta:{
        requireAuth: true
      }
    },
    {
      path: '/reportView',
      name: 'ReportView',
      component: ReportView,
      meta:{
        requireAuth: true
      }
    }      
    ,
    {
      path: '/userView',
      name: 'userView',
      component: UserView,
      meta:{
        requireAuth: true
      }
    },
    {
      path: '/reportEdit',
      name: 'ReportEdit',
      component: ReportEdit,
      meta:{
        requireAuth: true
      }
    }      
    ,
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta:{
        requireAuth: false
      }
    }  
  ]
})
