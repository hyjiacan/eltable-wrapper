module.exports = {
  publicPath: './',
  productionSourceMap: true,
  filenameHashing: false,
  configureWebpack: {
    optimization: {
      minimize: true
    },
    externals: {
      table: 'element-ui/lib/table',
      tableColumn: 'element-ui/lib/table-column',
      pagination: 'element-ui/lib/pagination',
      loading: 'element-ui/lib/loading',
      tableCss: 'element-ui/lib/theme-chalk/table.css',
      tableColumnCss: 'element-ui/lib/theme-chalk/table-column.css',
      paginationCss: 'element-ui/lib/theme-chalk/pagination.css'
    }
  }
}
