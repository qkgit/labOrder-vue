import request from '@/utils/request'


export default {
  // 查询字典管理列表
  listType(data) {
    return request({
      url: '/dict/type/list',
      method: 'post',
      data
    })
  },
  // 查询字典项列表
  listData(data) {
    return request({
      url: '/dict/data/list',
      method: 'post',
      data
    })
  },
  // 查询字典详细
  getDictType(dictId) {
    return request({
      url: `/dict/type/${dictId}`,
      method: 'get'
    })
  },
  getDictData(dictId) {
    return request({
      url: `/dict/data/${dictId}`,
      method: 'get'
    })
  },
  // 新增字典
  addDictType(data) {
    return request({
      url: '/dict/type',
      method: 'post',
      data
    })
  },
  // 新增字典项
  addDict(data) {
    return request({
      url: '/dict/data',
      method: 'post',
      data
    })
  },
  // 修改字典
  updateDictType(data) {
    return request({
      url: '/dict/type/',
      method: 'put',
      data
    })
  },
  // 修改字典项
  updateDict(data) {
    return request({
      url: '/dict/data/',
      method: 'put',
      data
    })
  },
  // 删除字典
  delType(dictIds) {
    return request({
      url: `/dict/type/${dictIds}`,
      method: 'delete',
    })
  },
  // 删除字典项
  delDict(dictIds) {
    return request({
      url: `/dict/data/${dictIds}`,
      method: 'delete',
    })
  }

} 

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: `/dict/data/type/${dictType}`,
    method: 'get'
  })
}


// 导出字典管理
// export function exportDict(query) {
//   return request({
//     url: '/system/dict/export',
//     method: 'get',
//     params: query
//   })
// }