import axios from '@/libs/api.request'
import qs from 'qs'

export const createGroup = data => {
  return axios.request({
    url: 'rest-api/grid/group/save',
    method: 'post',
    data
  })
}

export const deleteGroup = data => {
  return axios.request({
    url: 'rest-api/grid/group/remove',
    method: 'post',
    data: qs.stringify(data)
  })
}

export const getGroupGriders = params => {
  return axios.request({
    url: 'rest-api/grid/group/griders',
    method: 'get',
    params
  })
}

export const getGroupExtGriders = params => {
  return axios.request({
    url: 'rest-api/grid/group/extGriders',
    method: 'get',
    params
  })
}

export const griderModify = data => {
  return axios.request({
    url: 'rest-api/grid/group/grider/modify',
    method: 'post',
    data: qs.stringify(data)
  })
}

export const getGriderList = params => {
  return axios.request({
    url: 'rest-api/grid/grider/list',
    method: 'get',
    params
  })
}

export const getGirderGroups = params => {
  return axios.request({
    url: 'rest-api/grid/grider/groups',
    method: 'get',
    params
  })
}

export const mobileCheck = params => {
  return axios.request({
    url: 'rest-api/grid/grider/mobileCheck',
    method: 'get',
    params
  })
}

export const saveGrider = data => {
  return axios.request({
    url: 'rest-api/grid/grider/save',
    method: 'post',
    data
  })
}

export const deleteGrider = data => {
  return axios.request({
    url: 'rest-api/grid/grider/del',
    method: 'post',
    data: qs.stringify(data)
  })
}

export const groupsModify = data => {
  return axios.request({
    url: 'rest-api/grid/grider/groups/modify',
    method: 'post',
    data: qs.stringify(data)
  })
}