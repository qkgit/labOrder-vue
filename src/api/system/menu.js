import request from '@/utils/request'

export default {
    listMenu(query) {
        return request({
            url: '/menu/list',
            method: 'get',
            params: query
        })
    },
    addMenu(data) {
        return request({
            url: '/menu',
            method: 'post',
            data
        })
    }
}