import request from '@/utils/request'

export default {
    listMenu(query) {
        return request({
            url: '/menu/list',
            method: 'get',
            params: query
        })
    },
    getMenu(menuId){
        return request({
            url: `/menu/${menuId}`,
            method: 'GET'
        })
    },
    addMenu(data) {
        return request({
            url: '/menu',
            method: 'post',
            data
        })
    },
    updateMenu(data){
        return request({
            url: '/menu',
            method: 'PUT',
            data
        })
    },
    delMenu(menuId){
        return request({
            url: `/menu/${menuId}`,
            method: 'DELETE'
        })
    }
}