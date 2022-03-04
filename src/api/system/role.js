import request from '@/utils/request'

export default {
    listRole(pageQuery) {
        return request({
            url: '/role/list',
            method: 'post',
            data: pageQuery
        })
    }
}