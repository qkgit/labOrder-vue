import request from '@/utils/request'

export default {
    getClassroomCourseList(data){
        return request({
            url: '/order/classroom',
            method: 'post',
            data
          })
    },

    orderClassroom(orderId,classroomId,orderDate,orderNode){
        const orderData = {
            orderId ,
            classroomId,
            orderDate,
            orderNode
         }
        return request({
            url: '/order',
            method: 'post',
            data: orderData
          })
    }


}