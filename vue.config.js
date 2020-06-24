module.exports = {
  publicPath: './',
  productionSourceMap: true,
  filenameHashing: false,
  configureWebpack: {
    optimization: {
      minimize: true
    },
    externals: [
      'element-ui',
      'element-ui/lib/theme-chalk/table.css',
      'element-ui/lib/theme-chalk/table-column.css',
      'element-ui/lib/theme-chalk/pagination.css'
    ]
  }
}
