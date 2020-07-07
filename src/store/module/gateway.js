import { getGateWayList , saveGateWay , deleteGateWay , gateWayPanel, migrateGateWay, gatewayMqtt, gatewayUpload, saveGatewayPanel, getGatewayCurrent } from '@/api/gateway'

export default {
  state: {
  },
  mutations: {
  },
  actions: {
    // 获取网关列表
    getGateWayList ({ commit }, { pageSize, pageNo, name }) {
      return new Promise((resolve, reject) => {
        getGateWayList({ pageSize, pageNo, name }).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 编辑，保存节点
    saveGateWay ({ commit }, data) {
      return new Promise((resolve, reject) => {
        saveGateWay(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 删除节点
    deleteGateWay ({ commit }, data) {
      return new Promise((resolve, reject) => {
        deleteGateWay(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 网关面板详情
    gateWayPanel ({ commit }, data) {
      return new Promise((resolve, reject) => {
        gateWayPanel(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 网关迁移
    migrateGateWay ({ commit }, data) {
      return new Promise((resolve, reject) => {
        migrateGateWay(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 网关面板
    gatewayMqtt ({ commit }, data) {
      return new Promise((resolve, reject) => {
        gatewayMqtt(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 网关导入
    gatewayUpload ({ commit }, data) {
      return new Promise((resolve, reject) => {
        gatewayUpload(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 面板保存
    saveGatewayPanel ({ commit }, data) {
      return new Promise((resolve, reject) => {
        saveGatewayPanel(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 查询网关是否离线
    getGatewayCurrent ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getGatewayCurrent(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
  }
}
