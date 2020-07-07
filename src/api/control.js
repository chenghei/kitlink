import axios from '@/libs/api.request'
import qs from 'qs'

export const getLampGroupsList = params => {
    return axios.request({
        url: 'rest-api/application/lamp/groups/list',
        method: 'get',
        params
    })
}

export const saveLampGroups = data => {
    return axios.request({
        url: 'rest-api/application/lamp/groups/save',
        method: 'post',
        data
    })
}

export const deleteLampGroups = data => {
    return axios.request({
        url: 'rest-api/application/lamp/groups/delete',
        method: 'post',
        data: qs.stringify(data)
    })
}

export const getLampGroupsNodes = params => {
    return axios.request({
        url: `rest-api/application/lamp/groups/${params.groupId}/nodes`,
        method: 'get',
        params
    })
}

export const getNodeListAll = params => {
    return axios.request({
        url: 'rest-api/node/lists',
        method: 'get',
        params
    })
}

export const editLampGroups = data => {
    return axios.request({
        url: `rest-api/application/lamp/groups/${data.groupId}/nodes`,
        method: 'post',
        data: qs.stringify(data)
    })
}

export const getLampPlanList = params => {
    return axios.request({
        url: 'rest-api/application/lamp/control/plan/list',
        method: 'get',
        params
    })
}

export const getLampPlanDetail = params => {
    return axios.request({
        url: `rest-api/application/lamp/control/plans/${params.planId}/detail`,
        method: 'get',
        params
    })
}

export const saveLampPlan = data => {
    return axios.request({
        url: 'rest-api/application/lamp/control/plan/save',
        method: 'post',
        data
    })
}

export const deleteLampPlan = data => {
    return axios.request({
        url: 'rest-api/application/lamp/control/plan/delete',
        method: 'post',
        data: qs.stringify(data)
    })
}

export const addLampPlanDetail = data => {
    return axios.request({
        url: `rest-api/application/lamp/control/plans/${data.planId}/detail`,
        method: 'post',
        data
    })
}

export const removeLampPlanDetail = data => {
    return axios.request({
        url: `rest-api/application/lamp/control/plans/${data.planId}/detail/remove`,
        method: 'post',
        data: qs.stringify(data)
    })
}

export const getLampGroupsAll = params => {
    return axios.request({
        url: `rest-api/application/lamp/groups`,
        method: 'get',
        params
    })
}

export const getLampPlanGroup = params => {
    return axios.request({
        url: `rest-api/application/lamp/control/plans/${params.planId}/groups`,
        method: 'get',
        params
    })
}

export const assignLampPlan = data => {
    return axios.request({
        url: `rest-api/application/lamp/control/plans/${data.planId}/assign`,
        method: 'post',
        data: qs.stringify(data)
    })
}

export const lightControlDownlink = data => {
    return axios.request({
        url: `rest-api/node/light/control/${data.devEui}/downlink`,
        method: 'post',
        data
    })
}