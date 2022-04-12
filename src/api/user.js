import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user/info/',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function uploadAvatar(data){
  return request({
    url: '/user/profile/avatar',
    method: 'post',
    data: data
  })
}

export function updPwd(oldpwd, pwd) {
  return request({
    url: '/user/profile/updatePwd',
    method: 'put',
    data: { 'oldPwd': oldpwd, 'pwd': pwd }
  })
}

export function updateUser(data){
  return request({
    url: '/user/profile',
    method: 'put',
    data
  })
}
