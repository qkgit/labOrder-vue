import request from '@/utils/request'

export default {

/** ===========>> 课程时间Api  */
    listTime(data){
        return request({
            url: '/course/times',
            method: 'post',
            data
          })
    },
    getDefaultTime(){
        return request({
            url: '/course/defaultTime',
            method: 'get',
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
    },

/** ===========>> 课程Api  */
    listCourse(data){
        return request({
            url: '/course/list',
            method: 'post',
            data
          })
    },
    getCourse(id){
        return request({
            url: `/course/${id}`,
            method: 'get',
        })
    },
    addCourse(data){
        return request({
            url: '/course',
            method: 'post',
            data
        })
    },
    updateCourse(data){
        return request({
            url: '/course',
            method: 'put',
            data
        })
    },
    deleteCouseByIds(ids){
        return request({
            url: `/course/${ids}`,
            method: 'delete',
        })
    },

/** ===========>> 课程表Api  */
    listCourseTable(data) {
        return request({
            url: '/course/table/list',
            method: 'post',
            data
        })
    },
    getTableInfo(id){
        return request({
            url: `/course/table/${id}`,
            method: 'get',
        })
    },
    addTableInfo(data){
        return request({
            url: '/course/table',
            method: 'post',
            data
        })
    },
    updateTableInfo(data){
        return request({
            url: '/course/table',
            method: 'put',
            data
        })
    },
    deleteTableInfoByIds(ids){
        return request({
            url: `/course/table/${ids}`,
            method: 'delete',
        })
    }

}

// 根据部门名称查询部门
export function getCourseByName(name) {
    return request({
        url: '/course/getByName/' + name,
        method: 'get'
    })
}