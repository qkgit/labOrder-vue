import request from '@/utils/request'

export default {
    getClassroomCourseList(data){
        return request({
            url: '/order/classroom',
            method: 'post',
            data
          })
    },
    orderClassroom(data){
        return request({
            url: '/order',
            method: 'post',
            data
          })
    },
    getOrderListByUser(data){
        return request({
            url: '/order/record/classroom',
            method: 'post',
            data
        })
    },
    cencelOrder(id){
        return request({
            url: `/order/cencel/${id}`,
            method: 'put'
        })
    }


}