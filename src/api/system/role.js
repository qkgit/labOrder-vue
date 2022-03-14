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
    }
}