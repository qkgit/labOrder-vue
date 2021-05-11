import request from '@/utils/request'

export default {
  getLabList(data) {
    return request({
      url: '/labList',
      method: 'post',
      data
    })
  },
  getById(id) {
    return request({
      url: `/lab/${id}`,
      method: 'get'
    })
  },
  addLab(data) {
    return request({
      url: '/lab',
      method: 'post',
      data
    })
  },
  update(data) {
    return request({
      url: '/lab',
      method: 'put',
      data
    })
  },
  deleteById(id) {
    return request({
      url: `/lab/${id}`,
      method: 'delete'
    })
  },
  getAllLab() {
    return request({
      url: '/labs',
      method: 'get'
    })
  },
  getLabsTop() {
    return request({
      url: '/labsTop',
      method: 'get'
    })
  }

}
