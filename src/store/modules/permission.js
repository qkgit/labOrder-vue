import { asyncRoutes, constantRoutes } from '@/router'

/**
 * 使用 meta.role 来确定当前用户是否具有权限
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    // 如果该路由项配置了 权限
    // 判断路由权限中包不包括该用户
    return route.meta.roles.includes(roles)
  } else {
    // 如果没有配置权限 则所有人可见
    return true
  }
}

/**
 * 通过递归过滤异步路由表
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      let isAdmin = 0
      roles.forEach((role) => {
        if (role.roleId === '0') {
          isAdmin = 1
        }
      })
      // roles.includes('0')
      if (isAdmin === 1) {
        accessedRoutes = asyncRoutes || []
      } else {
        roles.forEach((role) => {
          accessedRoutes = filterAsyncRoutes(asyncRoutes, role.roleId)
        })
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
