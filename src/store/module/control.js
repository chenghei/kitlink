import { getLampGroupsList, saveLampGroups, deleteLampGroups, getLampGroupsNodes, getNodeListAll, editLampGroups, getLampPlanList, getLampPlanDetail, saveLampPlan,deleteLampPlan, addLampPlanDetail, removeLampPlanDetail,getLampPlanAll, getLampGroupsAll, getLampPlanGroup, assignLampPlan, lightControlDownlink } from '@/api/control'

export default {
    state: {
    },
    mutations: {
    },
    actions: {
        // 获取项目列表
        getLampGroupsList ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getLampGroupsList(params).then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 灯控分组添加/编辑
        saveLampGroups ({ commit }, data) {
            return new Promise((resolve, reject) => {
                saveLampGroups(data).then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 灯控分组删除
        deleteLampGroups ({ commit }, data) {
            return new Promise((resolve, reject) => {
                deleteLampGroups(data).then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 获取灯控分组节点列表
        getLampGroupsNodes ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getLampGroupsNodes(params).then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 获取灯控所有节点
        getNodeListAll ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getNodeListAll(params).then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 分组单灯节点编辑
        editLampGroups ({ commit }, data) {
            return new Promise((resolve, reject) => {
                editLampGroups(data).then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 获取控制计划列表
        getLampPlanList ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getLampPlanList(params).then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        
        // 获取控制计划详情
        getLampPlanDetail ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getLampPlanDetail(params).then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 新增/编辑控制计划
        saveLampPlan ({ commit }, params) {
            return new Promise((resolve, reject) => {
                saveLampPlan(params).then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 删除控制计划
        deleteLampPlan ({ commit }, params) {
            return new Promise((resolve, reject) => {
                deleteLampPlan(params).then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 添加控制计划明细
        addLampPlanDetail ({ commit }, params) {
            return new Promise((resolve, reject) => {
                addLampPlanDetail(params).then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 控制计划明细删除
        removeLampPlanDetail ({ commit }, data) {
            return new Promise((resolve, reject) => {
                removeLampPlanDetail(data).then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 获取全部分组列表
        getLampGroupsAll ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getLampGroupsAll(params).then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 获取控制计划所应用的分组列表
        getLampPlanGroup ({ commit }, params) {
            return new Promise((resolve, reject) => {
                getLampPlanGroup(params).then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 获取控制计划所应用的分组列表
        assignLampPlan ({ commit }, data) {
            return new Promise((resolve, reject) => {
                assignLampPlan(data).then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 单灯控制-指令下发
        lightControlDownlink ({ commit }, data) {
            return new Promise((resolve, reject) => {
                lightControlDownlink(data).then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            })
        },
    }
}