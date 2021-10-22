import request from '@/utils/request'


export default {
  // 查询字典管理列表
  listType(query) {
    return request({
      url: '/dict/type/list',
      method: 'post',
      data: query
    })
  },
  listData(data) {
    return request({
      url: '/dict/data/list',
      method: 'post',
      data
    })
  },
  // 查询字典管理详细
  getDict(dictId) {
    return request({
      url: `/dict/${dictId}`,
      method: 'get'
    })
  },
  // 新增字典管理
  addDict(data) {
    return request({
      url: '/dict',
      method: 'post',
      data: data
    })
  },
  // 修改字典管理
  updateDict(data) {
    return request({
      url: '/dict',
      method: 'put',
      data: data
    })
  }
} 
// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: '/system/dict/data/type/' + dictType,
    method: 'get'
  })
}






// 删除字典管理
export function delDict(uuid) {
  return request({
    url: '/system/dict/' + uuid,
    method: 'delete'
  })
}

// 导出字典管理
export function exportDict(query) {
  return request({
    url: '/system/dict/export',
    method: 'get',
    params: query
  })
}