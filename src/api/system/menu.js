import request from '@/utils/request'

export default {
    listMenu(query) {
        return request({
            url: '/menu/list',
            method: 'get',
            params: query
        })
    },
    getMenu(menuId) {
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
    updateMenu(data) {
        return request({
            url: '/menu',
            method: 'PUT',
            data
        })
    },
    delMenu(menuId) {
        return request({
            url: `/menu/${menuId}`,
            method: 'DELETE'
        })
    }
}

// 查询菜单下拉树结构
export function treeselect() {
    return request({
        url: '/menu/treeselect',
        method: 'get'
    })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId) {
    return request({
        url: `/menu/roleMenuTreeselect/${roleId}`,
        method: 'get'
    })
} 

// 用户获取路由菜单
export const getRouters = ()=>{
    return request({
        url: '/getRouters',
        method: 'GET'
    })
}