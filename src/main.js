import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets | css重置的现代替代方案

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n | 多语言

import '@/styles/index.scss' // global css | 通用css
import '@/styles/index.css' // 自定义样式

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon | 图标
import '@/permission' // permission control | 权限控制
import { getDicts } from '@/api/system/dict.js' // 获取字典项
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, download, handleTree } from '@/utils/baseUtils'
// import { from } from 'core-js/core/array'
/**
 * 如果您不想使用模拟服务器 mock-server
 * you want to use MockJs for mock api | 你想为mock api使用MockJs
 * you can execute: mockXHR() | 你可以执行以下命令: mockXHR()
 *
 * Currently MockJs will be used in the production environment, | 目前，MockJs将用于生产环境，
 * please remove it before going online ! ! ! | 请在上线前删除它！！！
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }
// console.log(process.env.NODE_ENV) // 开发环境 development ,生产环境 production
// console.log(process.env.VUE_APP_BASE_API)

// 全局方法挂载
Vue.prototype.getDicts = getDicts
// Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree

Vue.prototype.msgSuccess = function(msg) {
  this.$message({ showClose: true, message: msg == null ? 'O(∩_∩)O 操作成功' : msg, type: 'success' })
}

Vue.prototype.msgError = function(msg) {
  this.$message({ showClose: true, message: msg == null? 'Error' : msg, type: 'error' })
}

Vue.prototype.msgInfo = function(msg) {
  this.$message.info(msg)
}
// set ElementUI lang to EN | 设置elementUI 语言为英语
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
