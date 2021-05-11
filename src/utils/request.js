import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router'

// 创建一个 axios 对象
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // 请求超时
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

// 响应拦截器
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * 如果您想要获得http信息，例如头或状态
   * Please return  response => response
   * 请返回 响应 => 响应
   *
  */

  /**
   * Determine the request status by custom code
   * 通过自定义代码确定请求状态
   * Here is just an example
   * 这里只是一个例子
   * You can also judge the status by HTTP Status Code
   * 您还可以通过HTTP状态代码来判断状态
   */
  response => {
    const res = response.data
    // if the custom code is not 200, it is judged as an error.
    // 如果定制代码不是200，则判定为错误。
    if (res.resultCode !== '200') {
      if (res.resultCode == '1503') {
        // 1503 用户token验证失效  退出登录
        debugger
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
        Logout()
        return null
      } else if (res.resultCode == '1505') {
        // 判断用户首次登录
        return res
      } else {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }
    } else {
      return res
    }
  },
  error => {
    console.log('err：' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

async function Logout() {
  debugger
  await store.dispatch('user/logout')
  // await $store.dispatch("user/logout");
  router.push(`/login`)
}
export default service
