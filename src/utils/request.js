import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router'

// 创建一个 axios 对象
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 5000 // 请求超时
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // do something before request is sent  在发送请求之前做些什么

    if (store.getters.token) {
      // let each request carry token  让每个请求携带token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

/**
 *  响应拦截器
 * 如果您想要获得http信息，例如头或状态
 * Please return  response => response
 * 通过自定义代码确定请求状态
 *
 */
service.interceptors.response.use(response => {
  const res = response.data
  const code = res.resultCode
  const msg = res.message
  // 如果定制代码不是200，则判定为错误。
  if (code !== '200') {
    if (code == '1503') {
      // 1503 用户token验证失效  退出登录
      Message({
        message: msg,
        type: 'error',
        duration: 5 * 1000
      })
      Logout()
      return Promise.reject()
    } else if (code == '1505') {
      // 判断用户首次登录
      return res
    } else {
      Message({
        message: msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject()
    }
  } else {
    return res
  }
},
error => {
  console.log('err: ' + error) // for debug
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  })
  return Promise.reject(error)
}
)

async function Logout() {
  await store.dispatch('user/FedLogOut')
  // await $store.dispatch("user/logout");
  router.push(`/login`)
}
export default service
