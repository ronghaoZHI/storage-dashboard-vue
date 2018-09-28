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
        // Required - The path to the webpack-outputted app to prerender.
        staticDir: path.join(__dirname, 'dist'),
        // Required - Routes to render.
        routes: ['/login', '/bridge'],
      }),
    ],
  },
  devServer: {
    disableHostCheck: true,
    compress: true,
  },
  productionSourceMap: false,
}
