import request from '@/utils/request'

export default {
  getLabList(data) {
    return request({
      url: '/labOrders',
      method: 'post',
      data
    })
  },
  getSLabList(data) {
    return request({
      url: '/sLabOrders',
      method: 'post',
      data
    })
  },
  getTLabList(data) {
    return request({
      url: '/tLabOrders',
      method: 'post',
      data
    })
  },
  getExpNameByLId(loId) {
    return request({
      url: `/expName/${loId}`,
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `/labOrder/${id}`,
      method: 'get'
    })
  },
  addLabOrder(data) {
    return request({
      url: '/labOrder',
      method: 'post',
      data
    })
  },
  update(data) {
    return request({
      url: '/labOrders',
      method: 'put',
      data
    })
  },
  suspendById(id) {
    return request({
      url: `/suspend/${id}`,
      method: 'post'
    })
  },
  orderLab(data) {
    return request({
      url: '/orderLab',
      method: 'post',
      data: { 'loId': data }
    })
  },
  getOrderListByUser(data) {
    return request({
      url: '/orderList',
      method: 'post',
      data
    })
  },
  cencelOrder(data) {
    return request({
      url: '/cancelOrder',
      method: 'post',
      data: { 'loId': data }
    })
  },
  getOrderDetail(data) {
    return request({
      url: '/orderDetail',
      method: 'post',
      data
    })
  }

}
