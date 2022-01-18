import request from '@/utils/request'

export default {
    listTime(data){
        return request({
            url: '/course/times',
            method: 'post',
            data
          })
    },

    getTime(id){
        return request({
            url: `/course/time/${id}`,
            method: 'get',
        })
    },

    addTime(data){
        return request({
            url: '/course/time',
            method: 'post',
            data
        })
    },

    updateTime(data){
        return request({
            url: '/course/time',
            method: 'put',
            data
        })
    },

    deleteTimes(ids){
        return request({
            url: `/course/time/${ids}`,
            method: 'delete',
        })
    },

    UpgradeTime(id){
        return request({
            url: `/course/time/${id}`,
            method: 'post',
        }) 
    },

    SetDefaultTime(id){
        return request({
            url: `/course/time/${id}`,
            method: 'put',
        }) 
    }

}