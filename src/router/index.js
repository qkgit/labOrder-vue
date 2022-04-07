import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import ParentView from '@/components/ParentView'


/**
 * constantRoutes
 * 没有权限要求的基本页面
 * 所有角色都可以访问
 */
export const constantRoutes = [
  { // 登录页
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/updPwd',
    component: ParentView,
    children: [{
      path: '/',
      name: 'UpdPwd',
      component: () => import('@/views/updPassword/index'),
      meta: { title: '修改密码' },
      hidden: true
    }]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/index'),
        meta: { title: '首页', icon: 'el-icon-s-home', breadcrumb: false }
      },
      {
        path: '/myCenter',
        name: 'MyCenter',
        component: () => import('@/views/user/profile/index'),
        meta: { title: '个人中心' },
        hidden: true
      },
      {
        path: '/system/dict-data/:tableType',
        name: 'DictData',
        component: () => import('@/views/dict/data'),
        meta: { title: '字典详情', activeMenu: '/system/dict' },
        hidden: true,
      },
      {
        path: '/system/news/edit/:id',
        name: 'EditNews',
        component: () => import('@/views/news/edit'),
        meta: { title: '文章编辑', activeMenu: '/system/news' },
        hidden: true,
      },
      {
        path: '/newsDetail/:newsId',
        name: 'NewsDetail',
        component: () => import('@/views/news/detail'),
        meta: { title: '文章详情', breadcrumb: false },
        hidden: true,
      },
      {
        path: '/role-auth/user/:roleId',
        name: 'AuthUser',
        component: () => import('@/views/role/authUser'),
        meta: { title: '分配用户', activeMenu: '/system/role' },
        hidden: true
      }
    ]
  }
]

export const asyncRoutes = [];

const createRouter = () => new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

const router = createRouter()
export default router
