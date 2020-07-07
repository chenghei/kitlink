import { getLampPlanAll, getHistory } from '@/api/power'

export default {
  state: {
  },
  mutations: {
  },
  actions: {
    // 获取所有控制计划
    getLampPlanAll({ commit }, params) {
      return new Promise((resolve, reject) => {
        getLampPlanAll(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 获取灯控能耗历史数据
    getHistory ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getHistory(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
  }
}