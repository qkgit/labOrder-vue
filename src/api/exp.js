import request from '@/utils/request'

export default {
  getExpList(data) {
    return request({
      url: '/expList',
      method: 'post',
      data
    })
  },
  getById(id) {
    return request({
      url: `/exp/${id}`,
      method: 'get'
    })
  },
  addLab(data) {
    return request({
      url: '/exp',
      method: 'post',
      data
    })
  },
  update(data) {
    return request({
      url: '/exp',
      method: 'put',
      data
    })
  },
  deleteById(id) {
    return request({
      url: `/exp/${id}`,
      method: 'delete'
    })
  }

}
