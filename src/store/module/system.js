import {
  getOrganizationList,
  getOrganizationDetail,
  deleteOrganization,
  getRoleList,
  saveRole,
  nameCheck,
  deleteRole,
  getRoleUserList,
  getOrganizationUsers,
  roleAssign,
  deleteRoleUser,
  saveOrganization,
  getAcctList,
  saveAcct,
  getAcctInfo,
  deleteAcct,
  getRoleMenus,
  getDictionariesList,
  getDictionariesTypeList,
  saveDictionaries,
  deleteDictionaries,
  getLanguageList,
  saveLanguage,
  deleteLanguage,
  getConfigureList,
  getMenuList,
  getDictType,
  saveMenu,
  deleteMenu,
  saveConfig
} from '@/api/system'

export default {
  state: {
  },
  mutations: {
  },
  actions: {
    // 获取组织机构列表
    getOrganizationList ({ commit, state }, params) {
      return new Promise(async (resolve, reject) => {
        getOrganizationList(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取组织机构详情
    getOrganizationDetail ({ commit, state }, params) {
      return new Promise(async (resolve, reject) => {
        getOrganizationDetail(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 删除机构
    deleteOrganization ({ commit, state }, params) {
      return new Promise(async (resolve, reject) => {
        deleteOrganization(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取角色列表
    getRoleList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getRoleList(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 角色新增，编辑
    saveRole ({ commit }, data) {
      return new Promise((resolve, reject) => {
        saveRole(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 检查角色名称是否可用
    nameCheck ({ commit }, params) {
      return new Promise((resolve, reject) => {
        nameCheck(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 角色删除接口
    deleteRole ({ commit }, data) {
      return new Promise((resolve, reject) => {
        deleteRole(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取角色用户列表
    getRoleUserList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getRoleUserList(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取组织机构下账户
    getOrganizationUsers ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getOrganizationUsers(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 角色分配到用户接口
    roleAssign ({ commit }, params) {
      return new Promise((resolve, reject) => {
        roleAssign(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 将用户从分组中移除
    deleteRoleUser ({ commit }, data) {
      return new Promise((resolve, reject) => {
        deleteRoleUser(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 新增，编辑机构
    saveOrganization ({ commit }, data) {
      return new Promise((resolve, reject) => {
        saveOrganization(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取用户列表
    getAcctList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getAcctList(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 新增，编辑用户
    saveAcct ({ commit }, data) {
      return new Promise((resolve, reject) => {
        saveAcct(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取用户详情
    getAcctInfo ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getAcctInfo(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 删除用户
    deleteAcct ({ commit }, data) {
      return new Promise((resolve, reject) => {
        deleteAcct(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取角色详情
    getRoleMenus ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getRoleMenus(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取字典列表
    getDictionariesList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getDictionariesList(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取字典类型列表
    getDictionariesTypeList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        getDictionariesTypeList(params).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 新增，编辑字典
    saveDictionaries ({ commit }, data) {
      return new Promise((resolve, reject) => {
        saveDictionaries(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 删除字典
    deleteDictionaries ({ commit }, data) {
      return new Promise((resolve, reject) => {
        deleteDictionaries(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取语言列表
    getLanguageList ({ commit }, data) {
      return new Promise((resolve, reject) => {
        getLanguageList(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 新增/编辑语言
    saveLanguage ({ commit }, data) {
      return new Promise((resolve, reject) => {
        saveLanguage(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 删除语言
    deleteLanguage ({ commit }, data) {
      return new Promise((resolve, reject) => {
        deleteLanguage(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取配置列表
    getConfigureList ({ commit }, data) {
      return new Promise((resolve, reject) => {
        getConfigureList(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    //保存配置列表
    saveConfig ({ commit }, data) {
      return new Promise((resolve, reject) => {
        saveConfig(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取菜单列表
    getMenuList ({ commit }, data) {
      return new Promise((resolve, reject) => {
        getMenuList(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 新增/编辑菜单
    saveMenu ({ commit }, data) {
      return new Promise((resolve, reject) => {
        saveMenu(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 删除菜单
    deleteMenu ({ commit }, data) {
      return new Promise((resolve, reject) => {
        deleteMenu(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取机构类型和级别
    getDictTypes ({ commit }, data) {
      return new Promise((resolve, reject) => {
        getDictType(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
  }
}
