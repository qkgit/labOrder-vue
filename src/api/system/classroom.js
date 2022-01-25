import request from '@/utils/request'

export default {
    listRoom(data){
        return request({
            url: '/room/rooms',
            method: 'post',
            data
          })
    },
}