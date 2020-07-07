import { getGroups, getNodeType, getMiddleWare, searchByType, alarmDeal } from '@/api/base'
import { getDictType, getOrganizationList, getRoleList, getAreas, getMenuSubSysList } from '@/api/system'
import { parseJson } from '@/libs/util'
import { listUserMenus } from '@/api/user'
import { getSubSysList } from '@/api/data'
import { getNodes, getAlarmNodeType } from '@/api/monitor'

// 缓存时间 1分钟等于60000毫秒
const timeOut = 60000
export default {
  state: {
    groups: JSON.parse(sessionStorage.getItem('groups')) || null,
    nodeType: JSON.parse(sessionStorage.getItem('nodeType')) || null,
    middleWare: JSON.parse(sessionStorage.getItem('middleWare')) || null,
    typeNodes: JSON.parse(sessionStorage.getItem('typeNodes')) || null,
    dictType: JSON.parse(sessionStorage.getItem('dictType')) || null,
    menus: JSON.parse(sessionStorage.getItem('menus')) || null,
    subSysList: JSON.parse(sessionStorage.getItem('subSysList')) || null,
    organizationList: JSON.parse(sessionStorage.getItem('organizationList')) || null,
    roleList: JSON.parse(sessionStorage.getItem('roleList')) || null,
    areas: JSON.parse(sessionStorage.getItem('areas')) || null,
    menuSubSysList: JSON.parse(sessionStorage.getItem('menuSubSysList')) || null,
    mapNodeType: JSON.parse(sessionStorage.getItem('mapNodeType')) || null,
    alarmNodeType: JSON.parse(sessionStorage.getItem('alarmNodeType')) || null,
  },
  getters: {
    groups: state => state.groups ? parseJson(state.groups.list) : [],
    nodeType: state => state.nodeType ? state.nodeType.list : [],
    middleWare: state => state.middleWare ? state.middleWare.list : [],
    typeNodes: state => state.typeNodes ? state.typeNodes.list : [],
    dictType: state => state.dictType ? state.dictType.list : [],
    menus: state => state.menus ? state.menus.list : [],
    subSysList: state => state.subSysList ? state.subSysList.list : [],
    organizationList: state => state.organizationList ? state.organizationList.list : [],
    roleList: state => state.roleList ? state.roleList.list : [],
    areas: state => state.areas ? state.areas.list : [],
    menuSubSysList: state => state.menuSubSysList ? state.menuSubSysList.list : [],
    mapNodeType: state => state.mapNodeType ? state.mapNodeType.list : [],
    alarmNodeType: state => state.alarmNodeType ? state.alarmNodeType.list : [],
  },
  mutations: {
    setGroups (state, list) {
      const data = { loadTime: Date.now(), list }
      sessionStorage.setItem('groups', JSON.stringify(data))
      state.groups = data
    },
    setNodeType (state, list) {
      const data = { loadTime: Date.now(), list }
      sessionStorage.setItem('nodeType', JSON.stringify(data))
      state.nodeType = data
    },
    setMiddleWare (state, list) {
      const data = { loadTime: Date.now(), list }
      sessionStorage.setItem('middleWare', JSON.stringify(data))
      state.middleWare = data
    },
    setTypeNodes (state, list) {
      const data = { loadTime: Date.now(), list }
      sessionStorage.setItem('typeNodes', JSON.stringify(data))
      state.typeNodes = data
    },
    setDictType (state, list) {
      const data = { loadTime: Date.now(), list }
      sessionStorage.setItem('dictType', JSON.stringify(data))
      state.dictType = data
    },
    setMenus (state, list) {
      const data = { loadTime: Date.now(), list }
      sessionStorage.setItem('menus', JSON.stringify(data))
      state.menus = data
    },
    setSubSysList (state, list) {
      const data = { loadTime: Date.now(), list }
      sessionStorage.setItem('subSysList', JSON.stringify(data))
      state.subSysList = data
    },
    setOrganizationList (state, list) {
      const data = { loadTime: Date.now(), list }
      sessionStorage.setItem('organizationList', JSON.stringify(data))
      state.organizationList = data
    },
    setRoleList (state, list) {
      const data = { loadTime: Date.now(), list }
      sessionStorage.setItem('roleList', JSON.stringify(data))
      state.roleList = data
    },
    setAreas (state, list) {
      const data = { loadTime: Date.now(), list }
      sessionStorage.setItem('areas', JSON.stringify(data))
      state.areas = data
    },
    setMenuSubSysList (state, list) {
      const data = { loadTime: Date.now(), list }
      sessionStorage.setItem('menuSubSysList', JSON.stringify(data))
      state.menuSubSysList = data
    },
    setMapNodeType (state, list) {
      const data = { loadTime: Date.now(), list }
      sessionStorage.setItem('mapNodeType', JSON.stringify(data))
      state.mapNodeType = data
    },
    setAlarmNodeType (state, list) {
      const data = { loadTime: Date.now(), list }
      sessionStorage.setItem('alarmNodeType', JSON.stringify(data))
      state.alarmNodeType = data
    }
  },
  actions: {
    // 获取网格分组
    getGroups ({ commit, state }, params) {
      return new Promise(async (resolve, reject) => {
        // if (state.groups && state.groups.loadTime > 0 && state.groups.loadTime + timeOut > Date.now()) return
        const result = await getGroups(params)
        if (result.data.code === 0) commit('setGroups', result.data.rs.data)
        resolve(result)
      })
    },

    // 获取节点设备类型
    getNodeType ({ commit, state }) {
      return new Promise(async (resolve, reject) => {
        if (state.nodeType && state.nodeType.loadTime > 0 && state.nodeType.loadTime + timeOut > Date.now()) return
        const result = await getNodeType()
        if (result.data.code === 0) commit('setNodeType', result.data.rs.data)
        resolve(result)
      })
    },

    // 获取中间件列表
    getMiddleWare ({ commit, state }) {
      return new Promise(async (resolve, reject) => {
        if (state.middleWare && state.middleWare.loadTime > 0 && state.middleWare.loadTime + timeOut > Date.now()) return
        const result = await getMiddleWare()
        if (result.data.code === 0) commit('setMiddleWare', result.data.rs.data)
        resolve(result)
      })
    },

    // 根据节点类型获取节点列表
    searchByType ({ commit, state }, params) {
      return new Promise(async (resolve, reject) => {
        // if (state.typeNodes && state.typeNodes.loadTime > 0 && state.typeNodes.loadTime + timeOut > Date.now()) return
        const result = await searchByType(params)
        if (result.data.code === 0) commit('setTypeNodes', result.data.rs.data)
        resolve(result)
      })
    },

    // 根据类型查询列表接口
    getDictType ({ commit, state }, params) {
      return new Promise(async (resolve, reject) => {
        // if (state.dictType && state.dictType.loadTime > 0 && state.dictType.loadTime + timeOut > Date.now()) return
        const result = await getDictType(params)
        if (result.data.code === 0) commit('setDictType', result.data.rs.data)
        resolve(result)
      })
    },

    // 获取菜单
    getMenus ({ commit, state }, params) {
      return new Promise(async (resolve, reject) => {
        if (!params) {
          if (state.menus && state.menus.loadTime > 0 && state.menus.loadTime + timeOut > Date.now()) return
        }
        const result = await listUserMenus(params)
        if (result.data.code === 0) commit('setMenus', result.data.rs)
        resolve(result)
      })
    },

    // 获取子系统
    getSubSysLists ({ commit, state }, params) {
      return new Promise(async (resolve, reject) => {
        // if (state.subSysList && state.subSysList.loadTime > 0 && state.subSysList.loadTime + timeOut > Date.now()) return
        const result = await getSubSysList(params)
        if (result.data.code === 0) commit('setSubSysList', result.data.rs.data)
        resolve(result)
      })
    },

    // 获取菜单子系统
    getMenuSubSysList ({ commit, state }, params) {
      return new Promise(async (resolve, reject) => {
        if (state.menuSubSysList && state.menuSubSysList.loadTime > 0 && state.menuSubSysList.loadTime + timeOut > Date.now()) return
        const result = await getMenuSubSysList(params)
        if (result.data.code === 0) commit('setMenuSubSysList', result.data.rs.data)
        resolve(result)
      })
    },

    // 获取组织机构
    getOrganizationLists ({ commit, state }, params) {
      return new Promise(async (resolve, reject) => {
        // if (state.organizationList && state.organizationList.loadTime > 0 && state.organizationList.loadTime + timeOut > Date.now()) return
        const result = await getOrganizationList(params)
        if (result.data.code === 0) commit('setOrganizationList', result.data.rs.data)
        resolve(result)
      })
    },

    // 获取角色
    getRoleLists ({ commit, state }, params) {
      return new Promise(async (resolve, reject) => {
        // if (state.roleList && state.roleList.loadTime > 0 && state.roleList.loadTime + timeOut > Date.now()) return
        const result = await getRoleList(params)
        if (result.data.code === 0) commit('setRoleList', result.data.rs.data)
        resolve(result)
      })
    },

    // 区域
    getAreas ({ commit, state }, params) {
      return new Promise(async (resolve, reject) => {
        if (state.areas && state.areas.loadTime > 0 && state.areas.loadTime + timeOut > Date.now()) return
        const result = await getAreas(params)
        if (result.data.code === 0) commit('setAreas', result.data.rs.data)
        resolve(result)
      })
    },

    // 获取用户所有节点基础信息接口
    getNodes ({ commit, state }, params) {
      return new Promise(async (resolve, reject) => {
        if (!params) {
          if (state.mapNodeType && state.mapNodeType.loadTime > 0 && state.mapNodeType.loadTime + timeOut > Date.now()) return resolve()
        }
        const result = await getNodes(params)
        if (result.data.code === 0) commit('setMapNodeType', result.data.rs.data)
        resolve(result)
      })
    },

    // 获取所有节点设备节点类型
    getAlarmNodeType ({ commit, state }, params) {
      return new Promise(async (resolve, reject) => {
        if (state.alarmNodeType && state.alarmNodeType.loadTime > 0 && state.alarmNodeType.loadTime + timeOut > Date.now()) return
        const result = await getAlarmNodeType(params)
        if (result.data.code === 0) commit('setAlarmNodeType', result.data.rs.data)
        resolve(result)
      })
    },
    // 处理设备告警
    alarmDeal ({ commit }, params) {
      return new Promise((resolve, reject) => {
        alarmDeal(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
  }
}
