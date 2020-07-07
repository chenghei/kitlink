import { 
  createGroup,
  deleteGroup,
  getGroupGriders,
  getGroupExtGriders,
  griderModify,
  getGriderList,
  getGirderGroups,
  mobileCheck,
  saveGrider,
  deleteGrider,
  groupsModify
} from '@/api/grid'
import { getGroups } from '@/api/base'

export default {
  state: {
  },
  mutations: {
  },
  actions: {
    // 获取网格分组
    getGroupsList ({ commit, state }, params) {
      return new Promise(async (resolve, reject) => {
        getGroups(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 创建网格分组
    createGroup ({ commit }, data) {
      return new Promise((resolve, reject) => {
        createGroup(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 删除网格分组
    deleteGroup ({ commit }, data) {
      return new Promise((resolve, reject) => {
        deleteGroup(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取网格分组人员
    getGroupGriders ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getGroupGriders(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取网格组外的人员
    getGroupExtGriders ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getGroupExtGriders(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 网关分组人员操作
    griderModify ({ commit }, data) {
      return new Promise((resolve, reject) => {
        griderModify(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取网格员列表
    getGriderList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getGriderList(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取网格员所在分组列表
    getGirderGroups ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getGirderGroups(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 检查网格员手机号是否已被使用
    mobileCheck ({ commit }, data) {
      return new Promise((resolve, reject) => {
        mobileCheck(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 网格员新增，保存
    saveGrider ({ commit }, data) {
      return new Promise((resolve, reject) => {
        saveGrider(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 网格员删除
    deleteGrider ({ commit }, data) {
      return new Promise((resolve, reject) => {
        deleteGrider(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 网格员分组编辑
    groupsModify ({ commit }, data) {
      return new Promise((resolve, reject) => {
        groupsModify(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
