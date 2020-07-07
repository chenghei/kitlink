import axios from '@/libs/api.request'
import qs from 'qs'

export const getWorkOrderList = params => {
  return axios.request({
    url: 'rest-api/workOrder/list',
    method: 'get',
    params
  })
}

export const createWorkOrder = data => {
  return axios.request({
    url: 'rest-api/workOrder/create',
    method: 'post',
    data
  })
}

export const getWorkOrderHistory = params => {
  return axios.request({
    url: 'rest-api/workOrder/history',
    method: 'get',
    params
  })
}

export const closeWorkOrder = data => {
  return axios.request({
    url: 'rest-api/workOrder/close',
    method: 'post',
    data: qs.stringify(data)
  })
}