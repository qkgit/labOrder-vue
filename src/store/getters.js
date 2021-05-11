const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  institute: state => state.user.institute,
  major: state => state.user.major,
  permission_routes: state => state.permission.routes,
  isFirstlogin: state => state.user.isFirstlogin
}
export default getters
