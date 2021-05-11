import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar|进度条
import 'nprogress/nprogress.css' // progress bar style|进度条样式
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration|进度条设置

const whiteList = ['/login'] // 白名单

router.beforeEach(async(to, from, next) => {
  // 开始进度条
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 确定用户是否已经登录
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，则重定向到主页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 看下是否有用户信息
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        // 有信息进入目标路由
        next()
      } else {
        // 通过token 获取用户信息
        try {
          // 判断用户是否为首次登录
          const { isFirstlogin, roles } = await store.dispatch('user/getInfo')
          if (isFirstlogin == '1') {
            // 弹出修改密码界面
            next('/updPwd')
            NProgress.done()
            return
          } else {
            // 根据roles生成可访问的路由表
            const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
            // 动态添加可访问路由
            router.addRoutes(accessRoutes)
            // next()
            // router.addRoutes 之后的next()可能失效，可能因为next()时 路由并没有完全add好
            // 可以简单的通过next(to) 避开这个问题 这行代码重新进入router.beforEach()这个钩子
            // 再通过next() 来释放钩子
            next({ ...to, replace: true })
          }
        } catch (error) {
          // 删除令牌，转到登录页面重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || '出错了！')
          next(`/login`)
          NProgress.done()
        }
      }
    }
  } else {
    // 没有 token
    debugger
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免费登录白名单中，直接登录
      next()
    } else {
      // 其他没有访问权限的页面被重定向到登录页面。
      next(`/login`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 完成进度条 finish progress bar
  NProgress.done()
})
