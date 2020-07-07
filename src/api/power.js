import axios from '@/libs/api.request'

export const getLampPlanAll = params => {
  return axios.request({
    url: 'rest-api/application/lamp/control/plans',
    method: 'get',
    params
  })
}

export const getHistory = params => {
  return axios.request({
    url: 'rest-api/data/nodes/lamp/power/history',
    method: 'get',
    params
  })
}