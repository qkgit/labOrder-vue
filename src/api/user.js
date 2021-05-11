import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info/',
    method: 'post',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function updPwd(oldpwd, pwd) {
  return request({
    url: '/user/updatePwd',
    method: 'put',
    data: { 'oldPwd': oldpwd, 'pwd': pwd }
  })
}
