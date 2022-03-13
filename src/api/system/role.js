import request from '@/utils/request'

export default {
    listRole(pageQuery) {
        return request({
            url: '/role/list',
            method: 'post',
            data: pageQuery
        })
    },
    addRole(data){
        return request({
            url: '/role',
            method: 'post',
            data
        }) 
    },
    getRole(roleId){
        return request({
            url: `/role/${roleId}`,
            method: 'GET'
        })
    }
}