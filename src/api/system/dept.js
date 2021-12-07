import request from '@/utils/request'

export default {
  listDept(query) {
    return request({
      url: '/dept/list',
      method: 'get',
      params: query

    })
  },
  listDeptExcludeChild(deptId) {
    return request({
      url: '/dept/list/exclude/' + deptId,
      method: 'get'
    })
  },
  addDept(data) {
    return request({
      url: '/dept',
      method: 'post',
      data
    })
  },
  getDept(deptId) {
    return request({
      url: `/dept/${deptId}`,
      method: 'get'
    })
  },
  updateDept(data) {
    return request({
      url: '/dept',
      method: 'put',
      data: data
    })
  },
  delDept(deptId) {
    return request({
      url: `/dept/${deptId}`,
      method: 'delete'
    })
  }
}

// 查询部门下拉树结构
export function treeselect() {
  return request({
    url: '/dept/tree',
    method: 'get'
  })
}

// 根据角色ID查询部门树结构
export function roleDeptTreeselect(roleId) {
  return request({
    url: '/dept/roleDeptTreeselect/' + roleId,
    method: 'get'
  })
}
