const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')

const resolve = dir => {
  return path.join(__dirname, dir)
}

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
const BASE_URL = process.env.NODE_ENV === 'production'
  ? '/'
  : '/'
const needGzip = process.env.NODE_ENV === 'production'
module.exports = {
  publicPath: BASE_URL,
  outputDir: 'dist',
  assetsDir: 'assets',
  configureWebpack: config => {
    let plugins = []

    // gzip压缩
    if (needGzip) {
      plugins = [
        new CompressionPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: /\.css$|\.ttf$|\.html$|\.svg$|\.json$|\.js$/,
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: false// 删除原文件
        })
      ]
    }

    // 打包大小分析
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    plugins.push(
      new BundleAnalyzerPlugin(
        {
          analyzerMode: 'server',
          analyzerHost: '127.0.0.1',
          analyzerPort: 8888,
          reportFilename: 'report.html',
          defaultSizes: 'parsed',
          openAnalyzer: true,
          generateStatsFile: false,
          statsFilename: 'stats.json',
          statsOptions: null,
          logLevel: 'info'
        }
      )
    )
    return {
      plugins: plugins,
      // CDN资源引入
      externals: {
        'vue': 'Vue',
        'iview': 'iview',
        'vue-router': 'VueRouter',
        'vue-i18n': 'VueI18n',
        'vuex': 'Vuex',
        'axios': 'axios',
        'xlsx': 'XLSX',
        'moment': 'moment',
        'echarts': 'echarts',
        'BMap': 'BMap'
      },
      // 公共代码抽离
      optimization: {
        splitChunks: {
          cacheGroups: {
            vendor: {
              chunks: 'all',
              test: /node_modules/,
              name: 'vendor',
              minChunks: 1,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 100
            },
            common: {
              chunks: 'all',
              test: /[\\/]src[\\/]js[\\/]/,
              name: 'common',
              minChunks: 2,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 60
            },
            styles: {
              name: 'styles',
              test: /\.(sa|sc|c)ss$/,
              chunks: 'all',
              enforce: true
            },
            runtimeChunk: {
              name: 'manifest'
            }
          }
        }
      }
    }
  },
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
    // 图片压缩
    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        bypassOnDebug: true
      })
      .end()
  },
  // 打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  css: {
    // 启用 CSS modules
    modules: false,
    // 是否使用css分离插件
    extract: false,
    // 开启 CSS source maps，一般不建议开启
    sourceMap: false
  },
  devServer: {
    port: 1881,
    proxy: 'http://192.168.199.86:8083'
  }
}
