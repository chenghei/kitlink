import axios from '@/libs/api.request'
import qs from 'qs'

export const getOrganizationList = params => {
  return axios.request({
    url: 'rest-api/sys/organization/list',
    method: 'get',
    params
  })
}

export const getOrganizationDetail = params => {
  return axios.request({
    url: 'rest-api/sys/organization/detail',
    method: 'get',
    params
  })
}

export const deleteOrganization = data => {
  return axios.request({
    url: 'rest-api/sys/organization/del',
    method: 'post',
    data: qs.stringify(data)
  })
}

export const getRoleList = params => {
  return axios.request({
    url: 'rest-api/sys/role/list',
    method: 'get',
    params
  })
}

export const saveRole = data => {
  return axios.request({
    url: 'rest-api/sys/role/save',
    method: 'post',
    data
  })
}

export const nameCheck = params => {
  return axios.request({
    url: 'rest-api/sys/role/nameCheck',
    method: 'get',
    params
  })
}

export const deleteRole = data => {
  return axios.request({
    url: 'rest-api/sys/role/del',
    method: 'post',
    data: qs.stringify(data)
  })
}

export const getRoleUserList = params => {
  return axios.request({
    url: 'rest-api/sys/role/user/list',
    method: 'get',
    params
  })
}

export const getOrganizationUsers = params => {
  return axios.request({
    url: 'rest-api/sys/organization/users',
    method: 'get',
    params
  })
}

export const roleAssign = data => {
  return axios.request({
    url: 'rest-api/sys/role/assign',
    method: 'post',
    data: qs.stringify(data)
  })
}

export const deleteRoleUser = data => {
  return axios.request({
    url: 'rest-api/sys/role/user/remove',
    method: 'post',
    data: qs.stringify(data)
  })
}

export const getAreas = params => {
  return axios.request({
    url: 'rest-api/sys/areas',
    method: 'get',
    params
  })
}

export const saveOrganization = data => {
  return axios.request({
    url: 'rest-api/sys/organization/save',
    method: 'post',
    data
  })
}

export const getDictType = params => {
  return axios.request({
    url: 'rest-api/sys/dict/type',
    method: 'get',
    params
  })
}

export const getAcctList = params => {
  return axios.request({
    url: 'rest-api/sys/acct/list',
    method: 'get',
    params
  })
}

export const saveAcct = data => {
  return axios.request({
    url: 'rest-api/sys/acct/save',
    method: 'post',
    data
  })
}

export const deleteAcct = data => {
  return axios.request({
    url: 'rest-api/sys/acct/del',
    method: 'post',
    data: qs.stringify(data)
  })
}

export const getAcctInfo = params => {
  return axios.request({
    url: 'rest-api/sys/acct/info',
    method: 'get',
    params
  })
}

export const getRoleMenus = params => {
  return axios.request({
    url: 'rest-api/sys/role',
    method: 'get',
    params
  })
}
// 获取菜单子系统
export const getMenuSubSysList = params => {
  return axios.request({
    url: 'rest-api/sys/subSys/list',
    method: 'get',
    params
  })
}
// 新增/编辑菜单
export const saveMenu = data => {
  return axios.request({
    url: 'rest-api/sys/menu/save',
    method: 'post',
    data
  })
}
// 删除菜单
export const deleteMenu = data => {
  return axios.request({
    url: 'rest-api/sys/menu/del',
    method: 'post',
    data: qs.stringify(data)
  })
}
// 获取字典列表
export const getDictionariesList = params => {
  return axios.request({
    url: 'rest-api/sys/dict/list',
    method: 'get',
    params
  })
}

// 获取字典类型列表
export const getDictionariesTypeList = params => {
  return axios.request({
    url: 'rest-api/sys/dict/type/list',
    method: 'get',
    params
  })
}

// 字典新增/编辑
export const saveDictionaries = data => {
  return axios.request({
    url: 'rest-api/sys/dict/save',
    method: 'post',
    data
  })
}

// 字典删除
export const deleteDictionaries = data => {
  return axios.request({
    url: 'rest-api/sys/dict/del',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 获取语言列表
export const getLanguageList = params => {
  return axios.request({
    url: 'rest-api/sys/i18n/list',
    method: 'get',
    params
  })
}

// 语言新增/编辑
export const saveLanguage = data => {
  return axios.request({
    url: 'rest-api/sys/i18n/save',
    method: 'post',
    data
  })
}

// 语言删除
export const deleteLanguage = data => {
  return axios.request({
    url: 'rest-api/sys/i18n/del',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 获取配置列表
export const getConfigureList = params => {
  return axios.request({
    url: 'rest-api/sys/config/list',
    method: 'get',
    params
  })
}

//获取菜单列表
export const getMenuList = params => {
  return axios.request({
    url: 'rest-api/sys/menu/list',
    method: 'get',
    params
  })
}

export const saveConfig = data => {
  return axios.request({
    url: 'rest-api/sys/config/save',
    method: 'post',
    data: qs.stringify(data)
  })
}