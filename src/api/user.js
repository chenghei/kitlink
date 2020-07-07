import axios from '@/libs/api.request'
import qs from 'qs'

export const login = ({ username, password }) => {
  const data = {
    username,
    password
  }
  return axios.request({
    url: 'api/access/token',
    data,
    method: 'post'
  })
}

export const getUserInfo = () => {
  return axios.request({
    url: 'rest-api/user/basic',
    method: 'get'
  })
}

export const listUserMenus = params => {
  return axios.request({
    url: 'rest-api/sys/menu/getUserMenus',
    method: 'get',
    params
  })
}

export const personalSettings = data => {
  return axios.request({
    url: 'rest-api/user/personal/settings',
    method: 'post',
    data
  })
}

export const changePassword = data => {
  return axios.request({
    url: 'rest-api/user/changePwd',
    method: 'post',
    data: qs.stringify(data)
  })
}

export const uploadHeader = data => {
  return axios.request({
    url: 'rest-api/files/upload/header',
    method: 'post',
    data
  })
}

export const logout = () => {
  return axios.request({
    url: 'api/access/logout',
    method: 'post',
    
  })
}
