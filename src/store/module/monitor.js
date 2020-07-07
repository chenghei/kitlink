import { getOnlineList, getNodesStatistics, getAlarmStatistics, getAlarmEvents, getNodesAlarmList, getAlarmRules, getAlarmNodesInfo, getNodesRx, searchByCondition, getOfflineNodes, getNodesLatestData, lowVoltage } from '@/api/monitor'

export default {
  state: {
    alarmList: []
  },
  mutations: {
    setAlarmList (state, list) {
      state.alarmList = list
    }
  },
  actions: {
    // 获取在线设备列表
    getOnlineList ({ commit }, data) {
      return new Promise((resolve, reject) => {
        getOnlineList(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取节点数据统计
    getNodesStatistics ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getNodesStatistics(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取告警数据统计
    getAlarmStatistics ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getAlarmStatistics(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取最新预警数据
    getAlarmEvents ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getAlarmEvents(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取已处理告警列表
    getNodesAlarmList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getNodesAlarmList(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 获取告警设备详情
    getAlarmNodesInfo ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getAlarmNodesInfo(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 根据fport获取告警规则
    getAlarmRules ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getAlarmRules(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    
    // 卡片模式-获取节点列表
    getNodesRx ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getNodesRx(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 卡片模式-搜索节点
    searchByCondition ({ commit }, params) {
      return new Promise((resolve, reject) => {
        searchByCondition(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 获取离线设备列表
    getOfflineNodes ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getOfflineNodes(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 获取节点上送的设备数据
    getNodesLatestData ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getNodesLatestData(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 获取低电压设备数量
    lowVoltage ({ commit }, params) {
      return new Promise((resolve, reject) => {
        lowVoltage(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }

  }
}