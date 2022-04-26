import request from '@/utils/request'

export default {
    getClassroomCourseList(data){
        return request({
            url: '/order/classroom',
            method: 'post',
            data
          })
    }
}