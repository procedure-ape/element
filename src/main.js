// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import VueResource from 'vue-resource'
import echarts from 'echarts'
import store from '@/vuex/store'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.css'
// import './util/request'
import './util/debug'
import './util/response'

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts

Vue.use(ElementUI)
Vue.use(VueResource)
/* eslint-disable no-new */

new Vue({
  el: '#app',
  router: router.router,
  store,
  template: '<App/>',
  components: { App }
})
