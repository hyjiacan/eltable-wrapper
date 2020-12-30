module.exports = {
  publicPath: './',
  productionSourceMap: false,
  filenameHashing: false,
  configureWebpack: {
    // optimization: {
    //   minimize: true
    // },
    output: {
      library: 'ElTableWrapper',
      libraryExport: 'default'
    },
    externals: process.env.NODE_ENV === 'production' ? [
      'deep-diff',
      'element-ui/lib/theme-chalk/index.css',
      'merge',
      {
        'element-ui': 'ELEMENT'
      }
    ] : []
  }
}
