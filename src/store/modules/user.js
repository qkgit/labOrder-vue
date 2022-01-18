import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    isFirstLogin: '',
    name: '',
    avatar: '',
    institute: '',
    major: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_INSTITUTE: (state, institute) => {
    state.institute = institute
  },
  SET_MAJOR: (state, major) => {
    state.major = major
  },
  SET_ISFIRSTLOGIN: (state, isFirstLogin) => {
    state.isFirstLogin = isFirstLogin
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ loginName: username.trim(), password: password }).then(response => {
        //todo 判断用户首次登录  
        const { data } = response
        commit('SET_TOKEN', data)
        // //将token存入cookies中
        setToken(data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        
        const { data } = response
        if (!data) {
          return reject(response.message)
        }
        debugger
        const { realName, avatar, institute, major, isFirstLogin } = data
        commit('SET_NAME', realName)
        commit('SET_AVATAR', avatar)
        commit('SET_INSTITUTE', institute)
        commit('SET_MAJOR', major)
        commit('SET_ISFIRSTLOGIN',isFirstLogin)
        // if (isFirstlogin === '1') {
        //   data.roles = 99
        // }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 前端 登出
  FedLogOut({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

