import axios from '@/libs/api.request'

export const getNodeType = () => {
  return axios.request({
    url: 'rest-api/node/type/list',
    method: 'get'
  })
}

export const getMiddleWare = () => {
  return axios.request({
    url: 'rest-api/middleware/list',
    method: 'get'
  })
}

export const getGroups = params => {
  return axios.request({
    url: 'rest-api/grid/groups',
    method: 'get',
    params
  })
}

export const searchByType = params => {
  return axios.request({
    url: 'rest-api/node/searchByType',
    method: 'get',
    params
  })
}
export const alarmDeal = data => {
  return axios.request({
    url: 'rest-api/alarm/deal',
    method: 'post',
    data
  })
}