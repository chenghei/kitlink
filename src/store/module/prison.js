import { getPrisonMap, getPrisonMapMark, updateMapMark, insertMapMark, deleteMapMark } from '@/api/prison'

export default {
    state: {
    },
    mutations: {
    },
    actions: {
        // 获取平面图
        getPrisonMap ({ commit }, data) {
            return new Promise((resolve, reject) => {
                getPrisonMap(data).then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 获取平面图上的点(mysql)
        getPrisonMapMark ({ commit }, data) {
            return new Promise((resolve, reject) => {
                getPrisonMapMark(data).then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 更新  打点(mysql)
        updateMapMark ({ commit }, data) {
            return new Promise((resolve, reject) => {
                updateMapMark(data).then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 新增  打点(mysql)
        insertMapMark ({ commit }, data) {
            return new Promise((resolve, reject) => {
                insertMapMark(data).then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 删除  打点(mysql)
        deleteMapMark ({ commit }, data) {
            return new Promise((resolve, reject) => {
                deleteMapMark(data).then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
    }
}