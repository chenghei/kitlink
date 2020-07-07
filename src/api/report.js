import axios from '@/libs/api.request'

export const overView = params => {
  return axios.request({
    url: 'rest-api/report/overView',
    method: 'get',
    params
  })
}

export const getReportMessage = params => {
  return axios.request({
    url: 'rest-api/report/message',
    method: 'get',
    params
  })
}