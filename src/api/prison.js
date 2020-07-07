import axios from '@/libs/api.request'

export const getPrisonMap = (data) => {
  return axios.request({
    url: 'rest-api/data/api/q_lamp_floor_by_token',
    method: 'post',
    data
  })
}

export const getPrisonMapMark = (data) => {
    return axios.request({
      url: 'rest-api/data/api/q_lamp_mark_by_floor_id',
      method: 'post',
      data
    })
}

export const updateMapMark = (data) => {
    return axios.request({
      url: 'rest-api/dataApi/autoUpdate/u_lamp_floor_mark',
      method: 'post',
      data
    })
}

export const insertMapMark = (data) => {
    return axios.request({
      url: 'rest-api/dataApi/autoInsert/i_lamp_floor_mark',
      method: 'post',
      data
    })
}

export const deleteMapMark = (data) => {
    return axios.request({
      url: 'rest-api/dataApi/autoUpdate/d_lamp_floor_mark',
      method: 'post',
      data
    })
}

