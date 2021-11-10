import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   如果设置为true，项目将不会显示在侧边栏中(默认为false)
 * alwaysShow: true               如果设置为true，将始终显示根菜单
 *                                如果没有设置alwaysShow，当项目有多个子路径时，
 *                                它将变成嵌套模式，否则不会显示根菜单
 * redirect: noRedirect           重定向地址，在面包屑中点击会重定向去的地址
 *                                如果设置了noRedirect将不会在面包屑中重定向
 * name:'router-name'             设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']    // 设置该路由进入的权限，支持多个权限叠加
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'/'el-icon-x' // 设置该路由的图标，支持 svg-class，也支持 el-icon-x element-ui 的 icon
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
    activeMenu: '/example/list'  // 如果设置路径，侧边栏将高亮显示您设置的路径
  }
 */

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
  { // 首页
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: '/home',
      name: 'Home',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'el-icon-s-home', breadcrumb: false }
    }]
  },
  { // 修改密码
    path: '/updPwd',
    component: Layout,
    children: [{
      path: '/',
      name: 'UpdPwd',
      component: () => import('@/views/updPassword/index'),
      meta: { title: '修改密码', icon: '' },
      hidden: true
    }]
  },
  { // 个人中心
    path: '/myCenter',
    component: Layout,
    children: [{
      path: '/',
      name: 'MyCenter',
      component: () => import('@/views/myCenter/index'),
      meta: { title: '个人中心' },
      hidden: true
    }]
  },
  { // 文章详情页
    path: '/newsDetail',
    component: Layout,
    children: [{
      path: '/newsDetail/:newsId',
      name: 'newsDetail',
      component: () => import('@/views/news/detail'),
      meta: { title: '文章详情', breadcrumb: false, roles: ['0', '1', '2', '99'] },
      hidden: true,
      props: true
    }]
  }
 
]

/**
 * asyncRoutes
 * 需要根据用户角色动态加载的路由
 */
export const asyncRoutes = [

  /** =====================管理员 路由================================ **/

  // 字典管理
  {
    path: '/sDict',
    component: Layout,
    redirect: '/sDict/index',
    name: 'SDict',
    meta: {
      title: '字典管理',
      icon: 'dict',
      roles: ['0']
    },
    children: [
      {
        path: 'index',
        name: 'sDictType',
        component: ()=> import('@/views/dict/index'),
        meta: {
          breadcrumb: false,
          title: '字典管理',
          icon: 'dict',
          roles: ['0']
        }
      },
      {
        path: '/sDict/:tableType',
        name: 'sDictData',
        component: ()=> import('@/views/dict/data'),
        meta: {title: '字典详情',roles: ['0']},
        hidden: true,
        props: true
      },
    ]
  },
  // 部门管理
  {
    path: '/dept',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Dept',
        component: () => import('@/views/dept/index'),
        meta: {
          title: '组织管理',
          icon: 'tree',
          roles: ['0']
        }
      }
    ]
  },
  // 预约管理
  {
    path: '/labOrder',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'LabOrder',
        component: () => import('@/views/labOrder/index'),
        meta: {
          title: '预约管理',
          icon: 'el-icon-s-order',
          roles: ['0']
        }
      },
      {
        path: 'detail/:id',
        name: 'OrderDetail',
        component: () => import('@/views/labOrder/orderDetail'),
        meta: {
          title: '预约详情',
          icon: 'el-icon-data-line',
          roles: ['0']
        },
        hidden: true,
        props: true
      }

    ]
  },
  // 实验室管理
  {
    path: '/lab',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Lab',
        component: () => import('@/views/lab/index'),
        meta: {
          title: '实验室管理',
          icon: 'el-icon-s-help',
          roles: ['0']
        }
      }

    ]
  },
  // 实验管理
  {
    path: '/experiment',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Experiment',
        component: () => import('@/views/experiment/index'),
        meta: {
          title: '实验管理',
          icon: 'el-icon-attract',
          roles: ['0']
        }
      }
    ]
  },
  // 用户管理
  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'User',
        component: () => import('@/views/user/index'),
        meta: {
          title: '用户管理',
          icon: 'el-icon-user-solid',
          roles: ['0']
        }
      }
    ]
  },
  // 公告管理
  {
    path: '/news',
    component: Layout,
    // redirect: '/new/index',
    name: 'News',
    children: [
      {
        path: 'index',
        name: 'LeaveWord',
        component: () => import('@/views/news/index'),
        meta: {
          title: '公告管理',
          icon: 'el-icon-data-line',
          roles: ['0']
        }
      },
      {
        path: 'edit/:id',
        name: 'EditNews',
        component: () => import('@/views/news/edit'),
        meta: {
          title: '文章编辑',
          icon: 'el-icon-data-line',
          roles: ['0']
        },
        hidden: true,
        props: true
      }
    ]
  },

  // =========================用户 路由================================

  // 实验室预约
  {
    path: '/orderLab',
    component: Layout,
    redirect: '/orderLab/teachOrder',
    name: 'OrderLab',
    meta: {
      title: '实验室预约',
      icon: 'nested'
    },
    children: [
      {
        path: 'teachOrder',
        component: () => import('@/views/orderLab/teachOrder/index'),
        name: 'TeachOrder',
        meta: { title: '教学预约', icon: 'el-icon-tickets', roles: ['1'] },
      },
      {
        path: 'openOrder',
        component: () => import('@/views/orderLab/openOrder/index'),
        name: 'OpenOrder',
        meta: { title: '开放预约', icon: 'el-icon-tickets', roles: ['1', '2'] }
      },
      {
        path: 'orderClass',
        component: () => import('@/views/orderClass/index'),
        name: 'orderClass',
        meta: { title: '教室预约', icon: 'el-icon-tickets', roles: ['1', '2'] }
      }
    ]
  },
  // 预约记录查询
  {
    path: '/labOrderDetil',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'labOrderDetil',
        component: () => import('@/views/labOrderDetil/index'),
        meta: {
          title: '查询预约记录',
          icon: 'el-icon-notebook-2',
          roles: ['1', '2']
        }
      }

    ]
  },
  // 在线留言
  {
    path: '/leaveWord',
    component: Layout,
    redirect: '/leaveWord/index',
    children: [
      {
        path: 'index',
        name: 'LeaveWord',
        component: () => import('@/views/leaveWord/index'),
        meta: {
          title: '在线留言',
          icon: 'el-icon-edit-outline',
          roles: ['1', '2']
        }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    meta: { title: '404', icon: 'el-icon-error' },
    hidden: true
  },
  // 404页面必须放在最后!!
  { path: '*', redirect: '/404', hidden: true }
]
const createRouter = () => new Router({
  mode: 'history', // require service support | 需要服务支持
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
