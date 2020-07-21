module.exports = {
  publicPath: './',
  productionSourceMap: false,
  filenameHashing: false,
  configureWebpack: {
    optimization: {
      minimize: false
    },
    externals: process.env.NODE_ENV === 'production' ? [
      'element-ui/lib/table',
      'element-ui/lib/table-column',
      'element-ui/lib/pagination',
      'element-ui/lib/loading',
      'element-ui/lib/theme-chalk/table.css',
      'element-ui/lib/theme-chalk/table-column.css',
      'element-ui/lib/theme-chalk/pagination.css'
    ] : []
  }
}
