// import axios from 'axios'
import { Message } from 'iview'
import { getToken, setToken, getUid, getHid, getSid } from '@/libs/util'
import store from '@/store'
// import { Spin } from 'iview'

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl + '/p/a/'
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      timeout: 20000,
      headers: {
        authorization: getToken(),
        uid: getUid(),
        h: getHid(),
        sid: getSid()
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const { data, status } = res
      if (status === 200) {
        if (data.code !== 0) Message.error(data.msg)
      } else {
        Message.error(data.msg)
      }
      return { data, status }
    }, error => {
      this.destroy(url)
      const err = error.response
      // 判断请求超时
      if (error.message.includes('timeout')) {   
        Message.error('请求超时')
        return Promise.reject(error)        
      }

      if (err.status === 401) {
        let token = ''
        if (err.data.rs) token = err.data.rs.token
        if (token) {
          setToken(token)
          return Promise.reject(err)
        } else {
          store.dispatch('handleLogOut').then(() => {
            window.location = '/login'
          })
        }
      } else if (err.status === 500) {
        Message.error('服务器内部错误')
        return Promise.reject(error)
      }
      Message.error(err.data.msg)
      return Promise.reject(err)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
