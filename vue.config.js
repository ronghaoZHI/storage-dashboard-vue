const path = require('path')
const PrerenderSPAPlugin = require('prerender-spa-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  lintOnSave: true,
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('api$', resolve('src/api/index.js'))
      .set('helper', resolve('src/service/Helper.js'))
      .set('querystring', 'querystring-browser')
    config.output.chunkFilename('[name].bundle.js')

    config.when(
      process.env.NODE_ENV === 'production',
      (config) => config.output.chunkFilename('[contenthash].bundle.js'),
      (config) => config.performance.hints(false),
    )
  },
  configureWebpack: {
    plugins: [
      new PrerenderSPAPlugin({
        staticDir: path.join(__dirname, 'dist'),
        routes: ['/login', '/bridge'],
      }),
    ],
  },
  devServer: {
    disableHostCheck: true,
    compress: true,
    proxy: {
      '/api': {
        target: 'http://dashboardapi-rrs.cwn.baishancloud.com:9090',
        changeOrigin: true,
        pathRewrite: function(path) {
          return path.replace('/api', '')
        },
      },
    },
  },
  productionSourceMap: false,
}
