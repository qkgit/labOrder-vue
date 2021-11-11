import request from '@/utils/request'

export default {
    listDept(query) {
        return request({
            url: '/dept/list',
            method: 'get',
            params: query
           
        })
    },
    addDept(data) {
        return request({
            url: '/dept',
            method: 'post',
            data
        })
    }
}