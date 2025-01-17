import {
  getBreadCrumbList,
  setTagNavListInLocalstorage,
  getMenuByRouter,
  getTagNavListFromLocalstorage,
  getHomeRoute,
  getNextRoute,
  routeHasExist,
  routeEqual,
  getRouteTitleHandled,
  localSave,
  localRead,
  backendMenusToRouters,
  setHid,
  getHid
} from '@/libs/util'
import beforeClose from '@/router/before-close'
import { getSubSysList } from '@/api/data'
import { listUserMenus } from '@/api/user'
import router from '@/router'
import routers from '@/router/routers'
import config from '@/config'
const { homeName } = config

const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route)
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route)
  })
  router.push(nextRoute)
}

export default {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: getHomeRoute(routers, homeName),
    local: localRead('local'),
    errorList: [],
    hasReadErrorPage: false,
    routers: [],
    hasGetRouter: false,
    h: getHid()
  },
  getters: {
    menuList: (state, getters, rootState) => getMenuByRouter(state.routers, rootState.user.access),
    routes: state => state.routers,
    errorCount: state => state.errorList.length
  },
  mutations: {
    setHid (state, id) {
      state.h = id
      setHid(id)
    },
    setRouters (state, routers) {
      state.routers = routers
    },
    setHasGetRouter (state, status) {
      state.hasGetRouter = status
    },
    setBreadCrumb (state, route) {
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute)
    },
    setTagNavList (state, list) {
      let tagList = []
      if (list) {
        tagList = [...list]
      } else tagList = getTagNavListFromLocalstorage() || []
      if (tagList[0] && tagList[0].name !== homeName) tagList.shift()
      let homeTagIndex = tagList.findIndex(item => item.name === homeName)
      if (homeTagIndex > 0) {
        let homeTag = tagList.splice(homeTagIndex, 1)[0]
        tagList.unshift(homeTag)
      }
      state.tagNavList = tagList
      setTagNavListInLocalstorage([...tagList])
    },
    closeTag (state, route) {
      let tag = state.tagNavList.filter(item => routeEqual(item, route))
      route = tag[0] ? tag[0] : null
      if (!route) return
      if (route.meta && route.meta.beforeCloseName && route.meta.beforeCloseName in beforeClose) {
        new Promise(beforeClose[route.meta.beforeCloseName]).then(close => {
          if (close) {
            closePage(state, route)
          }
        })
      } else {
        closePage(state, route)
      }
    },
    addTag (state, { route, type = 'unshift' }) {
      let router = getRouteTitleHandled(route)
      if (!routeHasExist(state.tagNavList, router)) {
        if (type === 'push') state.tagNavList.push(router)
        else {
          if (router.name === homeName) state.tagNavList.unshift(router)
          else state.tagNavList.splice(1, 0, router)
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setLocal (state, lang) {
      localSave('local', lang)
      state.local = lang
    },
    addError (state, error) {
      state.errorList.push(error)
    },
    setHasReadErrorLoggerStatus (state, status = true) {
      state.hasReadErrorPage = status
    }
  },
  actions: {
    // 获取用户菜单
    getRouters ({ commit }) {
      return new Promise((resolve, reject) => {
        try {
          listUserMenus().then(res => {
            // const data = res.data.rs
            const data = [
              {
                path: '/administration',
                name: 'administration',
                meta: {
                  title: '行政管理',
                  hideInMenu: true
                },
                component: () => import('@/fire/administration/index.vue')
              }
            ]
            let routers = backendMenusToRouters(data)
            commit('setRouters', routers)
            commit('setHasGetRouter', true)
            resolve(routers)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    // 获取用户应用列表
    getSubSysList ({ commit }) {
      return new Promise((resolve, reject) => {
        try {
          getSubSysList().then(res => {
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    // 选择应用
    setSubSys ({ state, commit }, id) {
      return new Promise((resolve, reject) => {
        try {
          commit('setHid', id)
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
