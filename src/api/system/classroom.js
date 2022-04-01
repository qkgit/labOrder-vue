import request from '@/utils/request'

export default {
    listRoom(data) {
        return request({
            url: '/room/list',
            method: 'post',
            data
        })
    },
    getRoom(uuid) {
        return request({
            url: `/room/${uuid}`,
            method: 'get',
        })
    },
    addRoom(data) {
        return request({
            url: '/room',
            method: 'post',
            data
        })
    },
    updateRoom(data) {
        return request({
            url: '/room',
            method: 'put',
            data
        })
    },
    delRoom(ids) {
        return request({
            url: `/room/${ids}`,
            method: 'DELETE',
        })
    },
}

// 根据部门名称查询部门
export function getRoomByName(name) {
    return request({
        url: '/room/getByName/' + name,
        method: 'get'
    })
}