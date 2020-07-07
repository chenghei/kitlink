import axios from '@/libs/api.request'
import qs from 'qs'

export const getProjectList = params => {
  return axios.request({
    url: 'rest-api/application/lamp/projects/list',
    method: 'get',
    params
  })
}

export const saveProject = data => {
  return axios.request({
    url: 'rest-api/application/lamp/projects/save',
    method: 'post',
    data
  })
}

export const deleteProject = data => {
  return axios.request({
    url: 'rest-api/application/lamp/projects/delete',
    method: 'post',
    data: qs.stringify(data)
  })
}

export const getProjectAll = params => {
  return axios.request({
    url: 'rest-api/application/lamp/projects',
    method: 'get',
    params
  })
}

export const getLightPoleList = params => {
  return axios.request({
    url: 'rest-api/application/lamp/projects/lightPole/list',
    method: 'get',
    params
  })
}

export const saveLightPole = data => {
  return axios.request({
    url: 'rest-api/application/lamp/projects/lightPole/save',
    method: 'post',
    data
  })
}

export const deleteLightPole = data => {
  return axios.request({
    url: 'rest-api/application/lamp/projects/lightPole/delete',
    method: 'post',
    data: qs.stringify(data)
  })
}

export const getAmmeterList = params => {
  return axios.request({
    url: 'rest-api/application/lamp/projects/ammeter/list',
    method: 'get',
    params
  })
}

export const saveAmmeter = data => {
  return axios.request({
    url: 'rest-api/application/lamp/projects/ammeter/save',
    method: 'post',
    data
  })
}

export const deleteAmmeter = data => {
  return axios.request({
    url: 'rest-api/application/lamp/projects/ammeter/delete',
    method: 'post',
    data: qs.stringify(data)
  })
}