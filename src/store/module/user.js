import { login, getUserInfo, personalSettings, changePassword, uploadHeader, logout } from '@/api/user'
import { setToken, getToken, setUid, getUid, setSid, getSid } from '@/libs/util'
import Cookies from 'js-cookie'

export default {
  state: {
    userInfo: {},
    token: getToken(),
    uid: getUid(),
    sid: getSid(),
    access: [],
    hasGetInfo: false
  },
  getters: {
    userInfo: state => state.userInfo
  },
  mutations: {
    setUserInfo (state, info) {
      state.userInfo = info
    },
    setUserPhoto (state, info) {
      state.userInfo.photo = info
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setUid (state, uid) {
      state.uid = uid
      setUid(uid)
    },
    setSid (state, sid) {
      state.sid = sid
      setSid(sid)
    },
    setAccess (state, access) {
      state.access = access
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    }
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { username, password }) {
      return new Promise((resolve, reject) => {
        login({ username, password }).then(res => {
          const data = res.data
          if (data.code === 0) {
            commit('setToken', data.rs.token)
            commit('setUid', data.rs.uid)
            commit('setSid', data.rs.sid)
            sessionStorage.setItem('uid', data.rs.uid)
          }
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          logout().then(res => {
            localStorage.removeItem('local')
            sessionStorage.removeItem('index')
            Cookies.remove('token')
            Cookies.remove('uid')
            Cookies.remove('sid')
            Cookies.remove('h')
            resolve()
          }).catch(err => {
            localStorage.removeItem('local')
            sessionStorage.removeItem('index')
            window.location = '/login'
            reject(err)
          })
        } catch (err) {
          reject(err)
        }
        
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo().then(res => {
            const data = res.data
            if (data.code === 0) {
              commit('setUserInfo', data.rs.info)
              commit('setHasGetInfo', true)
            }
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    // 个人配置编辑接口
    personalSettings ({ commit }, data) {
      return new Promise((resolve, reject) => {
        personalSettings(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 修改密码
    changePassword ({ commit }, data) {
      return new Promise((resolve, reject) => {
        changePassword(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 上传头像
    uploadHeader ({ commit }, data) {
      return new Promise((resolve, reject) => {
        uploadHeader(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
  }
}
