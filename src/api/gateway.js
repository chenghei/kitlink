import axios from '@/libs/api.request'
import qs from 'qs'

export const getGateWayList = params => {
  return axios.request({
    url: 'rest-api/gateway/list',
    method: 'get',
    params
  })
}

export const saveGateWay = data => {
  return axios.request({
    url: 'rest-api/gateway/saveOrModify',
    method: 'post',
    data
  })
}

export const deleteGateWay = data => {
  return axios.request({
    url: 'rest-api/gateway/delete',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 网关管理详情
export const gateWayPanel = params => {
  return axios.request({
    url: 'rest-api/middleware/api/gateway/' + params.devEui + '?gateway_eui='+ params.devEui,
    method: 'get',
  })
}

// 网关迁移
export const migrateGateWay = data => {
  return axios.request({
    url: 'rest-api/gateway/migrate',
    method: 'post',
    data: qs.stringify(data)
  })
}

export const gatewayMqtt = data => {
  return axios.request({
    url: `rest-api/mqtt/sub?gateway_eui=${data.gateway_eui}`,
    method: 'post',
    data
  })
}

export const gatewayUpload = data => {
  return axios.request({
    url: `rest-api/gateway/import`,
    method: 'post',
    data
  })
}

export const saveGatewayPanel = data => {
  return axios.request({
    url: `rest-api/middleware/api/gateway/${data.gatewayEUI}?gateway_eui=${data.gatewayEUI}`,
    method: 'put',
    data
  })
}

export const getGatewayCurrent = params => {
  return axios.request({
    url: `rest-api/data/gateways/current/rx`,
    method: 'get',
    params
  })
}