import request from '@/utils/request'

export default {
  getMessages(data) {
    return request({
      url: '/getMessage',
      method: 'post',
      data
    })
  },
  postMessage(message) {
    return request({
      url: '/postMessage',
      method: 'post',
      data: { 'content': message }
    })
  }

}
