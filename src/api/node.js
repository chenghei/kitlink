import axios from '@/libs/api.request'
import qs from 'qs'

export const getNodeList = params => {
  return axios.request({
    url: 'rest-api/node/list',
    method: 'get',
    params
  })
}

export const saveNode = data => {
  return axios.request({
    url: 'rest-api/node/saveOrModify',
    method: 'post',
    data
  })
}

export const deleteNode = data => {
  return axios.request({
    url: 'rest-api/node/delete',
    method: 'post',
    data: qs.stringify(data)
  })
}

export const getNodeVendors = params => {
  return axios.request({
    url: 'rest-api/node/vendors',
    method: 'get',
    params
  })
}

export const migrateNode = data => {
  return axios.request({
    url: 'rest-api/node/migrate',
    method: 'post',
    data: qs.stringify(data)
  })
}

export const getNodeRule = params => {
  return axios.request({
    url: 'rest-api/alarm/rules/byNodeId',
    method: 'get',
    params
  })
}

export const saveNodeRule = data => {
  return axios.request({
    url: 'rest-api/alarm/rule/save',
    method: 'post',
    data
  })
}

export const saveNodeNotice = data => {
  return axios.request({
    url: 'rest-api/node/notify',
    method: 'post',
    data
  })
}

export const getNodeCurrent = params => {
  return axios.request({
    url: 'rest-api/data/nodes/current/rx',
    method: 'get',
    params
  })
}

export const getNodeBasic = params => {
  return axios.request({
    url: `rest-api/node/${params.nodeId}/basic`,
    method: 'get',
    params
  })
}

export const saveNodeBasic = data => {
  return axios.request({
    url: 'rest-api/node/updateBasic',
    method: 'post',
    data
  })
}

export const setVendor = data => {
  return axios.request({
    url: 'rest-api/node/setVendor',
    method: 'post',
    data
  })
}

export const getNodeRx = params => {
  return axios.request({
    url: `rest-api/data/node/${params.devEui}/rx`,
    method: 'get',
    params
  })
}

export const getNodeHistory = params => {
  return axios.request({
    url: `rest-api/data/node/${params.devEui}/history`,
    method: 'get',
    params
  })
}

export const batchDeleteNode = data => {
  return axios.request({
    url: 'rest-api/node/delete/batch',
    method: 'post',
    data:qs.stringify(data)
  })
}

export const mqtt = data => {
  return axios.request({
    url: `rest-api/mqtt/sub?dev_eui=${data.dev_eui}`,
    method: 'post',
    data
  })
}
 
export const getNode = params => {
  return axios.request({
    url: `rest-api/middleware/api/node/${params.dev_eui}`,
    method: 'get',
    params
  })
}

export const editNodePanel = data => {
  return axios.request({
    url: `rest-api/middleware/api/node/${data.devEUI}?dev_eui=${data.devEUI}`,
    method: 'put',
    data
  })
}

export const getNodeSession = params => {
  return axios.request({
    url: `rest-api/middleware/api/nodes/${params.dev_eui}/session`,
    method: 'get',
    params
  })
}

export const getDevAddr = data => {
  return axios.request({
    url: `rest-api/middleware/api/nodes/${data.dev_eui}/getRandomDevAddr?dev_eui=${data.dev_eui}`,
    method: 'post',
    data
  })
}

export const editNodeSession = (data, methods) => {
  return axios.request({
    url: `rest-api/middleware/api/nodes/${data.devEUI}/session?dev_eui=${data.devEUI}`,
    method: methods,
    data
  })
}

export const history = data => {
  return axios.request({
    url: `rest-api/mqtt/history`,
    method: 'post',
    data
  })
}

export const getDownlink = params => {
  return axios.request({
    url: `rest-api/middleware/api/nodes/${params.dev_eui}/queue`,
    method: 'get',
    params
  })
}

export const toUploadNode = data => {
  return axios.request({
    url: `rest-api/node/updateImp`,
    method: 'post',
    data
  })
}

export const saveUploadNode = data => {
  return axios.request({
    url: `rest-api/node/import`,
    method: 'post',
    data
  })
}