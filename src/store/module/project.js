import { getProjectList, saveProject, deleteProject, getProjectAll, getLightPoleList, saveLightPole, deleteLightPole, getAmmeterList, saveAmmeter, deleteAmmeter } from '@/api/project'

export default {
    state: {
    },
    mutations: {
    },
    actions: {
      // 获取项目列表
      getProjectList ({ commit }, params) {
        return new Promise((resolve, reject) => {
            getProjectList(params).then(res => {
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },

      // 项目新增/编辑
      saveProject ({ commit }, data) {
        return new Promise((resolve, reject) => {
          saveProject(data).then(res => {
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },

      // 项目删除
      deleteProject ({ commit }, data) {
        return new Promise((resolve, reject) => {
          deleteProject(data).then(res => {
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },

      // 获取所有项目
      getProjectAll ({ commit }, params) {
        return new Promise((resolve, reject) => {
          getProjectAll(params).then(res => {
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },

      // 获取灯杆列表
      getLightPoleList ({ commit }, params) {
        return new Promise((resolve, reject) => {
          getLightPoleList(params).then(res => {
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },

      // 灯杆新增/编辑
      saveLightPole ({ commit }, data) {
        return new Promise((resolve, reject) => {
          saveLightPole(data).then(res => {
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },

      // 灯杆删除
      deleteLightPole ({ commit }, data) {
        return new Promise((resolve, reject) => {
          deleteLightPole(data).then(res => {
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },

      // 获取电表列表
      getAmmeterList ({ commit }, params) {
        return new Promise((resolve, reject) => {
          getAmmeterList(params).then(res => {
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },

      // 电表新增/编辑
      saveAmmeter ({ commit }, data) {
        return new Promise((resolve, reject) => {
          saveAmmeter(data).then(res => {
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },

      // 电表删除
      deleteAmmeter ({ commit }, data) {
        return new Promise((resolve, reject) => {
          deleteAmmeter(data).then(res => {
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
    }
  }