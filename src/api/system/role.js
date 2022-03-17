import request from '@/utils/request'

export default {
    listRole(pageQuery) {
        return request({
            url: '/role/list',
            method: 'post',
            data: pageQuery
        })
    },
    getRole(roleId){
        return request({
            url: `/role/${roleId}`,
            method: 'get'
          })
    },
    addRole(data){
        return request({
            url: '/role',
            method: 'post',
            data
        }) 
    },
    updateRole(data){
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
    }
}