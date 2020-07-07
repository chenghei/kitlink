import { getNodeList, saveNode, deleteNode, getNodeVendors, migrateNode, getNodeRule, saveNodeRule, saveNodeNotice, getNodeCurrent, getNodeBasic, saveNodeBasic, getNodeRx, getNodeHistory, setVendor, batchDeleteNode, mqtt, getNode, editNodePanel, getNodeSession, getDevAddr, editNodeSession, history, getDownlink, toUploadNode, saveUploadNode } from '@/api/node'

export default {
  state: {
  },
  mutations: {
  },
  actions: {
    // 获取节点列表
    getNodeList ({ commit }, data) {
      return new Promise((resolve, reject) => {
        getNodeList(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 编辑，保存节点
    saveNode ({ commit }, data) {
      return new Promise((resolve, reject) => {
        saveNode(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 删除节点
    deleteNode ({ commit }, data) {
      return new Promise((resolve, reject) => {
        deleteNode(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 获取设备型号
    getNodeVendors ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getNodeVendors(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 节点转移
    migrateNode ({ commit }, params) {
      return new Promise((resolve, reject) => {
        migrateNode(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 获取节点告警规则
    getNodeRule ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getNodeRule(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 保存节点告警规则
    saveNodeRule ({ commit }, params) {
      return new Promise((resolve, reject) => {
        saveNodeRule(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 保存节点通知
    saveNodeNotice ({ commit }, params) {
      return new Promise((resolve, reject) => {
        saveNodeNotice(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 获取节点最新上送数据
    getNodeCurrent ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getNodeCurrent(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取节点基础信息
    getNodeBasic ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getNodeBasic(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 批量设置型号
    setVendor ({ commit }, params) {
      return new Promise((resolve, reject) => {
        setVendor(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 保存节点基础信息
    saveNodeBasic ({ commit }, data) {
      return new Promise((resolve, reject) => {
        saveNodeBasic(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取节点设备MQTT数据（节点面板-视图数据）
    getNodeRx ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getNodeRx(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取节点设备历史记录 （节点面板-数据列表）
    getNodeHistory ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getNodeHistory(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    //批量删除节点
    batchDeleteNode ({ commit }, params) {
      return new Promise((resolve, reject) => {
        batchDeleteNode(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    //mqtt
    mqtt ({ commit }, params) {
      return new Promise((resolve, reject) => {
        mqtt(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    //getNode
    getNode ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getNode(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    //节点详情保存节点状态
    editNodePanel ({ commit }, params) {
      return new Promise((resolve, reject) => {
        editNodePanel(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    //getNodeSession
    getNodeSession ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getNodeSession(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    //生成devAddr
    getDevAddr ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getDevAddr(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    //保存NodeSession
    editNodeSession ({ commit }, data) {
      return new Promise((resolve, reject) => {
        editNodeSession(data.data, data.methods).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    //详情历史
    history ({ commit }, data) {
      return new Promise((resolve, reject) => {
        history(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    //获取downlink列表
    getDownlink ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getDownlink(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    //更新导入
    toUploadNode ({ commit }, data) {
      return new Promise((resolve, reject) => {
        toUploadNode(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },

    //导入节点
    saveUploadNode ({ commit }, data) {
      return new Promise((resolve, reject) => {
        saveUploadNode(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
  }
}
