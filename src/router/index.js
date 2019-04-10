import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import test from '@/components/test'
import home from '@/components/Home'
import dashboard from '@/components/view/dashboard'
import instances from '@/components/view/instances'
import images from '@/components/view/images'
import snapshot from '@/components/view/snapshot'
import securityGroups from '@/components/view/securityGroups'
import routers from '@/components/view/routers'
import flavor from '@/components/view/flavor'
import storage from '@/components/view/storage'
import storageSnapshot from '@/components/view/storageSnapshot'
import topology from '@/components/view/topology'
import network from '@/components/view/network'
import floatIP from '@/components/view/floatIP'
import user from '@/components/view/user'
// import three from '@/components/three/test'

Vue.use(Router)

const router =  new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/test',
      component: test,
      children: [
        {
          path: '/',
          component: test
        },
        // {
        //   path: 'three',
        //   component: three
        // }
      ]
    },
    {
      path: '/home',
      component: home,
      children: [
        {
          path: '',
          redirect: 'dashboard'
        },
        {
          path: 'dashboard',
          component: dashboard
        },
        {
          path: 'instances',
          component: instances
        },
        {
          path: 'flavor',
          component: flavor
        },
        {
          path: 'images',
          component: images
        },
        {
          path: 'snapshot',
          component: snapshot
        },
        {
          path: 'storage',
          component: storage
        },
        {
          path: 'storageSnapshot',
          component: storageSnapshot
        },
        {
          path: 'topology',
          component: topology
        },
        {
          path: 'network',
          component: network
        },
        {
          path: 'floatIP',
          component: floatIP
        },
        {
          path: 'securityGroups',
          component: securityGroups
        },
        {
          path: 'routers',
          component: routers
        },
        {
          path: 'user',
          component: user
        }
      ]
    }
  ]
})

// 导航守卫
router.beforeEach((to, from, next) => {
  const user = sessionStorage.getItem('userstate')
  if(to.path != '/login' && !user){
    next('/login')
  }else{
    next()
  }
})

export default{
  router
}