//import Vue from 'vue'
//import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import { LoadingBar, Spin } from 'iview'
import { setToken, getToken, getHid, canTurnTo } from '@/libs/util'
import config from '@/config'
const { homeName } = config

Vue.use(VueRouter)
const router = new VueRouter({
  routes,
  mode: 'history'
})
const LOGIN_PAGE_NAME = 'login'

const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, store.state.app.routers.concat(routes))) next() // 有权限，可访问
  else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}

router.beforeEach((to, from, next) => {
  if (store.getters.routes.length > 0) {
    let system = store.getters.routes.find(v => v.name === 'system')
    if(system) {
      system = system.children[0].children.filter(v => v.hideInMenu === false)
    }
    if(to.name === 'system_role'){
      sessionStorage.setItem('index', system.findIndex((item) => item.name === 'system_role'))
    }
    if(to.name === 'system_mechanism'){
      sessionStorage.setItem('index', system.findIndex((item) => item.name === 'system_mechanism'))
    }
    if(to.name === 'system_menu'){
      sessionStorage.setItem('index', system.findIndex((item) => item.name === 'system_menu'))
    }
    if(to.name === 'system_dictionaries'){
      sessionStorage.setItem('index', system.findIndex((item) => item.name === 'system_dictionaries'))
    }
    if(to.name === 'system_configure'){
      sessionStorage.setItem('index', system.findIndex((item) => item.name === 'system_configure'))
    }
    if(to.name === 'system_language'){
      sessionStorage.setItem('index', system.findIndex((item) => item.name === 'system_language'))
    }
    if(to.name === 'system_rule'){
      sessionStorage.setItem('index', system.findIndex((item) => item.name === 'system_rule'))
    }
    if(to.name === 'system_deviceType'){
      sessionStorage.setItem('index', system.findIndex((item) => item.name === 'system_deviceType'))
    }
    let grid = store.getters.routes.find(v => v.name === 'grid')
    if(grid) {
      grid = grid.children[0].children.filter(v => v.hideInMenu === false)
    }
    if(to.name === "grid_groupIndex"){
      sessionStorage.setItem('index', grid.findIndex((item) => item.name === "grid_groupIndex"))
    }
    let monitor = store.getters.routes.find(v => v.name === 'monitor')
    if(monitor) {
      monitor = monitor.children[0].children.filter(v => v.hideInMenu === false)
    }
    if(to.name === "monitor_map"){
      sessionStorage.setItem('index', monitor.findIndex((item) => item.name === "monitor_map"))
    }
    if(to.name === "monitor_card"){
      sessionStorage.setItem('index', monitor.findIndex((item) => item.name === "monitor_card"))
    }
    let node = store.getters.routes.find(v => v.name === 'node')
    if(node) {
      node = node.children[0].children.filter(v => v.hideInMenu === false)
    }
    if(to.name === "node_nodeIndex"){
      sessionStorage.setItem('index', node.findIndex((item) => item.name === "node_nodeIndex"))
    }
    if(to.name === "node_engineering"){
      sessionStorage.setItem('index', node.findIndex((item) => item.name === "node_engineering"))
    }
  }
  if (to.name === 'system_user' || to.name === 'monitor_list' || to.name === 'grid_gridIndex'|| to.name === 'lamp_control_index_custom' || to.name === 'lamp_project_index_weProject' || to.name === 'lamp_power_index_chart' || to.name === 'lamp_prison_index_setting') {
    sessionStorage.setItem('index', 0)
  }
  if (to.name === 'lamp_control_index_group' || to.name === 'lamp_project_index_lampPole') {
    sessionStorage.setItem('index', 1)
  }
  if (to.name === 'lamp_control_index_detail' || to.name === 'lamp_project_index_lampAmmeter') {
    sessionStorage.setItem('index', 2)
  }
  if (to.name === 'lamp_control_index_assignGroup') {
    sessionStorage.setItem('index', 3)
  }
  
  LoadingBar.start()
  const token = getToken()
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    sessionStorage.removeItem('index')
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    sessionStorage.removeItem('index')
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: homeName // 跳转到homeName页
    })
  } else {
    if (store.state.user.hasGetInfo && store.state.app.hasGetRouter) {
      turnTo(to, store.state.user.access, next)
    } else {
      store.dispatch('getUserInfo').then(user => {
        // 当点击子系统进入才能获取h值
        if (to.name !== 'index') { 
          Spin.show({
            render: (h) => {
              return h('div', [
                h('Icon', {
                  'class': 'demo-spin-icon-load',
                  props: {
                    type: 'ios-loading',
                    size: 18
                  }
                }),
                h('div', '正在初始化系统数据,请稍后...')
              ])
            }
          })
          // 如果未获取到H值
          if (store.state.user.hasGetInfo === true && getHid() === false) {
            Spin.hide()
            next({ name: 'index' })
          }
          // 加载用户菜单
          store.dispatch('getRouters').then(routers => {
            Spin.hide()
            if (routers.length == 0) {
              next({ name: 'index' })
            }else{
              // commonRoutes需要追加到路由解析最后的404，把原先的routers.js中的404删掉即可
              router.addRoutes(routers.concat([
                {
                  path: '*',
                  name: 'error_404',
                  meta: {
                    hideInMenu: true
                  },
                  component: () => import('@/view/error-page/404.vue')
                }
              ]))
              next({ ...to })
            }
          })
        } else {
          next()
        }
      }).catch(() => {
        setToken('')
        next({ name: 'login' })
      })
    }
  }
})

router.afterEach(to => {
  LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
