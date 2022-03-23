import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'

// 设置进度条
NProgress.configure({ showSpinner: false })
// 路由白名单
const whiteList = ['/login']
// 路由跳转前置钩子函数
router.beforeEach(async (to, from, next) => {
  // 开始进度条
  NProgress.start()
  // 设置页面标题
  document.title = getPageTitle(to.meta.title)
  // 获取用户token
  const hasToken = getToken()
  /* **********************************  说  明  **************************************************
   ************************************************************************************************
   * 如果存在token且跳转登录页，则进行自动登录操作重定向到主页
   *  ==> 检查是否含有用户信息
   *        ==> 含有用户信息
   *           ==> 用户首次登录时 
   *               1.修改本地首次登录标识 
   *               2.跳转修改密码页面       ==> 首次登录出口  next({ path: '/updPwd' })
   *           ==> 用户非首次登录正常跳转    ==> 正常跳转出口  next()
   *       ==> 不含有用户信息
   *           ==> 1.通过token 获取用户信息  
   *               2.请求后台获取可访问的路由表 
   *               3.动态添加可访问路由
   *               4.等待路由添加并通过next(to)重新进入router.beforEach()这个钩子进行正常跳转
   ***************************************************************************************************                
  */
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      const hasGetUserInfo = store.getters.name;
      const isFirstLogin = store.getters.isFirstLogin;
      if (hasGetUserInfo) {
        if (isFirstLogin == '1') {
          await store.commit('user/SET_ISFIRSTLOGIN', '0')
          next({ path: '/updPwd' })
        } else {
          next()
        }
      } else {
        await store.dispatch('user/getInfo')
        try {
          const accessRoutes = await store.dispatch('permission/generateRoutes')
          router.addRoutes(accessRoutes)
          // router.addRoutes 之后的next()可能失效，可能因为next()时 路由并没有完全add好
          // 可以简单的通过next(to) 避开这个问题 这行代码重新进入router.beforEach()这个钩子
          // 再通过next() 来释放钩子
          next({ ...to, replace: true })
        } catch (error) {
          // 删除令牌，转到登录页面重新登录
          await store.dispatch('user/resetToken')
          // Message.error(error || '出错了！')
          next(`/login`)
        }
      }
    }
  } else {
    // 没有 token
    // 在免费登录白名单中，直接进入
    // 其他没有访问权限的页面被重定向到登录页面。
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login`)
    }
  }
})

router.afterEach(() => {
  // 完成进度条
  NProgress.done()
})
