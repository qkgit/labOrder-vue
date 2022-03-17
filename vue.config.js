'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title // page title

// 如果你的端口设置为80,
// 使用管理员特权执行命令行。
// 例如, Mac: sudo npm run
// 你可以通过以下方法改变端口:
// port = 9528 npm run dev 或 npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9527 // dev port

// /所有配置项的说明可以在 https://cli.vuejs.org/config/ 中找到
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,          
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,   
   * then publicPath should be set to "/bar/".                                                  
   * In most cases please use '/' !!!                                                           
   * Detail: https://cli.vuejs.org/config/#publicpath
   * 
   * 如果你计划在子路径下部署你的站点，你需要设置publicPath，
   * 例如GitHub页面。如果您计划将站点部署到https://foo.github.io/bar/，
   * 然后publicPath应该设置为"/bar/"
   * 在大多数情况下请使用/!!     详情:https://cli.vueis.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,

  devServer: {
    host: '127.0.0.1',
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {  //开发环境代理 解决跨域问题
      // 匹配 /dev-api 开头的请求
      [process.env.VUE_APP_BASE_API]: {
          target: 'http://localhost:5555',  //目标服务器，代理访问到
          //开启代理：本地会创建一个虚拟服务端，然后发送请求的数据
          //并同时接收请求的数据， 这样服务端和服务端进行数据交互就不会有跨域问题
          changOrigin: true, //开启代理
          pathRewrite: {
              //会将 /dev-api 替换为 '',也就是 /dev-api 会移除
              // 如 /dev-api/db.json  代理到 https://localhost:5555/db.json
              ['^'+process.env.VUE_APP_BASE_API]: ''
          }
        }
    },
    // before: require('./mock/mock-server.js')
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that       在webpack的name字段中提供应用程序的标题，以便
    // it can be accessed in index.html to inject the correct title.  可以在index.html中访问它以注入正确的标题。
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    //这样可以提高初屏速度，建议打开预加载
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js  忽略runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    // 当有很多页面时，会产生很多无意义的请求
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
