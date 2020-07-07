import { getWorkOrderList, createWorkOrder, getWorkOrderHistory, closeWorkOrder } from '@/api/workOrder'

export default {
  state: {
  },
  mutations: {
  },
  actions: {
    // 获取工单列表
    getWorkOrderList ({ commit }, data) {
      return new Promise((resolve, reject) => {
        getWorkOrderList(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取工单处理历史
    getWorkOrderHistory ({ commit }, { orderId }) {
      return new Promise((resolve, reject) => {
        getWorkOrderHistory({ orderId }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 创建工单
    createWorkOrder ({ commit }, data) {
      return new Promise((resolve, reject) => {
        createWorkOrder(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 关闭工单
    closeWorkOrder ({ commit }, data) {
      return new Promise((resolve, reject) => {
        closeWorkOrder(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
