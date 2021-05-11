import request from '@/utils/request'

export default {
  getNewsList(data) {
    return request({
      url: '/newsList',
      method: 'post',
      data
    })
  },
  getHomeNews() {
    return request({
      url: '/homeNews',
      method: 'get'
    })
  },
  getHomeInForm() {
    return request({
      url: '/homeInform',
      method: 'get'
    })
  },
  getNewsDetail(id) {
    return request({
      url: `/news/${id}`,
      method: 'get'
    })
  },
  releaseNews(id) {
    return request({
      url: `/releaseNews/${id}`,
      method: 'post'
    })
  },
  addNews(data) {
    return request({
      url: '/new',
      method: 'post',
      data
    })
  },
  update(data) {
    return request({
      url: '/news',
      method: 'put',
      data
    })
  },
  deleteById(id) {
    return request({
      url: `/news/${id}`,
      method: 'delete'
    })
  }

}
