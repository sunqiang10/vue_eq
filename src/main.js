// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import axios from 'axios' // 1、在这里引入axios 
import moment from 'moment'
import qs from "qs";

Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
    return moment(dataStr).utc().format(pattern)
})

Vue.prototype.baseUrl = process.env.NODE_ENV==="production"?"https://kpx.eqmap.cn":"http://127.0.0.1:5000"

// Vue.prototype.baseUrl = process.env.NODE_ENV==="production"?"https://kpx.eqmap.cn":"/api"
// axios.defaults.baseURL = '/api'
// axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
axios.defaults.withCredentials=true;

Vue.prototype.$axios = axios; // 2、在vue中使用axios kpx.eqmap.cn
Vue.config.productionTip = false
Vue.use(ElementUI);


router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) { // 判断跳转的路由是否需要登录
      if (sessionStorage['token']) { // vuex.state判断token是否存在
          next() // 已登录
      } else {
          next({
              path: '/login'
          })
      }
  } else {
    if(to.path === '/login'){
      next()
    }
    else{
      next({
        path: '/login'
      })
    }      
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})



// http request 拦截器
axios.interceptors.request.use(
  config => {
    // if (store.state.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
    //     config.headers.Authorization = `token ${store.state.token}`;
    // }
        // 兼容 post 跨域问题
    if (config.url.indexOf('/user/')>=0 && config.method === 'post') {
    
      // 修改 Content-Type
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        
      // 将对象参数转换为序列化的 URL 形式（key=val&key=val）
      
      // config.data = qs.stringify(config.data);
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });

// // http response 拦截器
// axios.interceptors.response.use(
//   response => {
//       return response;
//   },
//   error => {
//       if (error.response) {
//           switch (error.response.status) {
//               case 401:
//                   // 返回 401 清除token信息并跳转到登录页面
//                   store.commit(types.LOGOUT);
//                   router.replace({
//                       path: 'login',
//                       query: {redirect: router.currentRoute.fullPath}
//                   })
//           }
//       }
//       return Promise.reject(error.response.data)   // 返回接口返回的错误信息
//   });