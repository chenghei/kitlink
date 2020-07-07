import axios from '@/libs/api.request'

export const getSubSysList = () => {
  return axios.request({
    url: 'rest-api/sys/subSys/getSubSysList',
    method: 'get'
  })
}