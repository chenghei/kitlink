import { overView, getReportMessage } from '@/api/report'

export default {
  state: {
  },
  mutations: {
  },
  actions: {
    // 报表中心统计数据
    overView ({ commit }, data) {
      return new Promise((resolve, reject) => {
        overView(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 报表中心-最新消息接口
    getReportMessage ({ commit }, data) {
      return new Promise((resolve, reject) => {
        getReportMessage(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
  }
}
