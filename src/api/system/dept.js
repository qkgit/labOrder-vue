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
            url: `/dept/'${deptId}`,
            method: 'delete'
        })
    }
}