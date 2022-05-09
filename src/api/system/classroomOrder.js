import request from '@/utils/request'

export default {
    getClassroomCourseList(data){
        return request({
            url: '/order/classroom/list',
            method: 'post',
            data
          })
    },
    orderClassroom(data){
        return request({
            url: '/order/classroom',
            method: 'post',
            data
          })
    },
    getOrderListByUser(data){
        return request({
            url: '/order/classroom/record',
            method: 'post',
            data
        })
    },
    getOrderListByRole(data){
        return request({
            url: '/order/classroom/audit',
            method: 'post',
            data
        })
    },
    cencelOrder(id){
        return request({
            url: `/order/classroom/cencel/${id}`,
            method: 'put'
        })
    },
    passOrder(data){
        return request({
            url: '/order/classroom/audit/pass',
            method: 'put',
            data
        })
    },

    noPassOrder(data){
        return request({
            url: '/order/classroom/audit/nopass',
            method: 'put',
            data
        })
    }

}