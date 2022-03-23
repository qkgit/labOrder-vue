import request from '@/utils/request'

export default {
    listRoom(data){
        return request({
            url: '/room/list',
            method: 'post',
            data
          })
    },
    getRoom(uuid){
        return request({
            url: `/room/${uuid}`,
            method: 'get',
          })
    },
    addRoom(data){
        return request({
            url: '/room',
            method: 'post',
            data
        })
    },
    updateRoom(data){
        return request({
            url: '/room',
            method: 'put',
            data
        })
    }
}