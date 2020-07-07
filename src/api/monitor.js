import axios from '@/libs/api.request'
import qs from 'qs'

export const getNodes = params => {
  return axios.request({
    url: 'rest-api/data/nodes',
    method: 'get',
    params
  })
}

export const searchByDevEui = params => {
  return axios.request({
    url: 'rest-api/node/searchByDevEui',
    method: 'get',
    params
  })
}

export const getOnlineList = params => {
  return axios.request({
    url: 'rest-api/data/nodes/online/list',
    method: 'get',
    params
  })
}

export const getNodesStatistics = params => {
  return axios.request({
    url: 'rest-api/data/nodes/statistics',
    method: 'get',
    params
  })
}

export const getAlarmStatistics = params => {
  return axios.request({
    url: 'rest-api/data/alarm/statistics',
    method: 'get',
    params
  })
}

export const getAlarmEvents = params => {
  return axios.request({
    url: 'rest-api/data/alarm/events',
    method: 'get',
    params
  })
}

export const getAlarmNodeType = params => {
  return axios.request({
    url: 'rest-api/node/types',
    method: 'get',
    params
  })
} 
export const getAlarmNodesInfo = params => {
  return axios.request({
    url: 'rest-api/data/alarm/nodes/info',
    method: 'get',
    params
  })
}

export const getNodesAlarmList = params => {
  return axios.request({
    url: 'rest-api/data/nodes/alarm/list/history',
    method: 'get',
    params
  })
}

export const getAlarmRules = params => {
  return axios.request({
    url: 'rest-api/alarm/rules/byFport',
    method: 'get',
    params
  })
}

export const getCurrentAlarmList = params => {
  return axios.request({
    url: 'rest-api/data/nodes/alarm/list/current',
    method: 'get',
    params
  })
}

export const getNodesRx = params => {
  return axios.request({
    url: 'rest-api/data/nodes/rx',
    method: 'get',
    params
  })
}

export const searchByCondition = params => {
  return axios.request({
    url: 'rest-api/node/searchByCondition',
    method: 'get',
    params
  })
}

export const getOfflineNodes = params => {
  return axios.request({
    url: 'rest-api/data/nodes/offline/list',
    method: 'get',
    params
  })
}

export const getNodesLatestData = params => {
  return axios.request({
    url: 'rest-api/data/nodes/latest/data',
    method: 'get',
    params
  })
}

export const lowVoltage = params => {
  return axios.request({
    url: 'rest-api/data/alarm/statistics/lowVoltage',
    method: 'get',
    params
  })
}