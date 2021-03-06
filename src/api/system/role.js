import request from '@/utils/request'

export default {
    listRole(pageQuery) {
        return request({
            url: '/role/list',
            method: 'post',
            data: pageQuery
        })
    },
    listAllRole(){
        return request({
            url: '/role/list/all',
            method: 'get',
        })
    },
    getRole(roleId) {
        return request({
            url: `/role/${roleId}`,
            method: 'get'
        })
    },
    addRole(data) {
        return request({
            url: '/role',
            method: 'post',
            data
        })
    },
    updateRole(data) {
        return request({
            url: '/role',
            method: 'put',
            data
        })
    },
    changeRoleStatus(roleId, status) {
        const data = {
            roleId,
            status
        }
        return request({
            url: '/role/changeStatus',
            method: 'put',
            data: data
        })
    },
    delRole(roleIds) {
        return request({
            url: `/role/${roleIds}`,
            method: 'DELETE',
        })
    },
    // 查询角色已授权用户
    allocatedUserList(data) {
        return request({
            url: '/role/authUser/allocatedList',
            method: 'post',
            data
        })
    },
    // 查询角色未授权用户列表
    unallocatedUserList(data) {
        return request({
            url: '/role/authUser/unallocatedList',
            method: 'post',
            data
        })
    },
    // 取消授权角色用户
    authUserCancel(data){
        return request({
            url: '/role/authUser/cancel',
            method: 'put',
            data
        }) 
    },
    // 批量添加授权用户
    authUserSelectAll(data){
        return request({
            url: '/role/authUser/selectAll',
            method: 'put',
            data
          })
    },
   
}

// 获取角色部门用户下拉数
export function deptUserTreeSelect(roleId){
    return request({
        url: `/userTreeSelect/${roleId}`,
        method: 'GET'
    })
}