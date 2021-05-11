import request from '@/utils/request'

export default {
  getUserList(data) {
    return request({
      url: '/users',
      method: 'post',
      data
    })
  },
  getUserById(id) {
    return request({
      url: `/user/${id}`,
      method: 'get'
    })
  },
  addUser(data) {
    return request({
      url: '/user',
      method: 'post',
      data
    })
  },
  update(data) {
    return request({
      url: '/user',
      method: 'put',
      data
    })
  },
  deleteById(id) {
    return request({
      url: `/user/${id}`,
      method: 'delete'
    })
  },
  resetPwd(id) {
    return request({
      url: `/resetPwd/${id}`,
      method: 'put'
    })
  }

}
