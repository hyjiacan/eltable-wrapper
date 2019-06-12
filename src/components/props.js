const props = {
  // 通用 BEGIN===========================================================
  /**
   * 数据分页类型，可选值: l(local), i(increment), s(server)
   */
  type: {
    type: String,
    default: 's'
  },
  /**
   * 数据项的标识字段，若标识不在顶层，则使用数组传递
   * 也可以传入一个函数，函数接收一个行对象，函数的返回值将作为标识
   */
  idField: {
    type: [String, Array, Function],
    default: 'id'
  },
  /**
   * 是否自动调整高度，否则撑满整个容器
   */
  autoHeight: {
    type: Boolean,
    default: false
  },
  /**
   * 设置为 true 以使用高级选择
   * 此项在多选时生效，当启用时，会在跳转页面时记住选中项
   * 选择时，会使用 idField 作为选中数据的标识
   */
  advanceSelection: {
    type: Boolean,
    default: false
  },
  /**
   * 自定义的样式类
   */
  customClass: {
    type: String
  },
  /**
   * 分页条位置，可选值为 bottom top both
   */
  pagerPosition: {
    type: String,
    default: 'bottom'
  },
  headerSize: {
    type: [String, Number],
    default: 48
  },
  footerSize: {
    type: [String, Number],
    default: 40
  },
  /**
   * 默认的数据id，当未加载数据时，请求时使用此值
   */
  defaultId: {
    type: [String, Number],
    default: ''
  },
  /**
   * 指示表格选择模式，可选值为: 空, single, multiple，当表格列中指定了 type="selectionData" 时，会覆盖此值为 multiple
   */
  selection: {
    type: String
  },
  // 通用 END===========================================================

  // AJAX BEGIN===========================================================
  /**
   * 发送异步请求的方法，需要返回 Promise 对象
   */
  ajax: {
    type: Function
  },
  /**
   * 向服务器请求数据的url
   */
  url: {
    type: String
  },
  /**
   * 向服务器请求数据的method
   */
  method: {
    type: String,
    default: 'get'
  },
  /**
   * 向服务器请求数据的参数
   */
  params: {
    type: Object
  },
  responseHandler: {
    type: Function
  },
  /**
   * 在使用服务器数据源时，是否在挂载后自动加载数据
   */
  autoLoad: {
    type: Boolean,
    default: true
  },
  /**
   * 向服务器发送请求时，页码参数名
   */
  paramIndex: {
    type: String,
    default: 'pageIndex'
  },
  /**
   * 向服务器发送请求时，数据量参数名
   */
  paramSize: {
    type: String,
    default: 'pageSize'
  },
  /**
   * 服务器分页时，返回数据中的数据总量字段名称
   */
  totalField: {
    type: String,
    default: 'total'
  },
  /**
   * 服务器分页时，返回数据中的数据列表字段名称
   */
  listField: {
    type: String,
    default: 'list'
  },
  /**
   * 检查aja参数
   */
  checkParams: {
    type: Function
  },
  /**
   * 是否在ajax参数改变时自动重新加载数据
   */
  loadWhenParamsChange: {
    type: Boolean,
    default: false
  },
  // AJAX END===========================================================

  // 分页 BEGIN======================================================
  /**
   * 每页显示的数据量
   */
  pageSize: {
    type: [String, Number],
    default: 10
  },
  /**
   * 默认显示的页码
   */
  index: {
    type: [String, Number],
    default: 1
  },
  /**
   * 是否显示分页统计信息
   */
  showPagerSummary: {
    type: Boolean,
    default: true
  },
  // 分页 END======================================================

  // 增量 BEGIN======================================================
  /**
   * 增量分页时每次向服务器请求的数据量
   */
  incSize: {
    type: [String, Number],
    default: 80
  },
  /**
   * 增量加载数据时，增量参数名
   */
  paramInc: {
    type: String,
    default: 'lastId'
  },
  /**
   * 增量加载数据时，数据项的标识字段，用法与 idField 相同
   * 未指定时，使用 idField 的值
   */
  incId: {
    type: [String, Array, Function]
  },
  // 增量 END======================================================
  // Loading BEGIN======================================================
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: 'Loading...'
  },
  loadingIcon: {
    type: String,
    default: 'el-icon-loading'
  },
  loadingColor: {
    type: String,
    default: 'rgba(249, 249, 249, 0.9)'
  },
  // Loading END======================================================

  // ElTable 原生属性 BEGIN =======================================
  tMaxHeight: {
    type: [String, Number]
  },
  tStripe: {
    type: Boolean,
    default: false
  },
  tBorder: {
    type: Boolean,
    default: false
  },
  tSize: {
    type: String
  },
  tFit: {
    type: Boolean,
    default: true
  },
  tShowHeader: {
    type: Boolean,
    default: true
  },
  tCurrentRowKey: {
    type: [String, Number]
  },
  tRowClassName: {
    type: [String, Function]
  },
  tRowStyle: {
    type: [String, Function]
  },
  tCellClassName: {
    type: [String, Function]
  },
  tCellStyle: {
    type: [String, Function]
  },
  tHeaderRowClassName: {
    type: [String, Function]
  },
  tHeaderRowStyle: {
    type: [String, Function]
  },
  tHeaderCellClassName: {
    type: [String, Function]
  },
  tHeaderCellStyle: {
    type: [String, Function]
  },
  tRowKey: {
    type: [String, Function]
  },
  tEmptyText: {
    type: String,
    default: '暂无数据'
  },
  tDefaultExpandAll: {
    type: Boolean,
    default: false
  },
  tExpandRowKeys: {
    type: Array
  },
  tDefaultSort: {
    type: Object,
    default: () => {
      return {
        order: 'ascending'
      }
    }
  },
  tTooltipEffect: {
    type: String
  },
  tShowSummary: {
    type: Boolean,
    default: false
  },
  tSumText: {
    type: String,
    default: '合计'
  },
  tSummaryMethod: {
    type: Function
  },
  tSpanMethod: {
    type: Function
  },
  tSelectOnIndeterminate: {
    type: Boolean,
    default: true
  },
  tIndent: {
    type: Number,
    default: 16
  },
  tLazy: {
    type: Boolean
  },
  tLoad: {
    type: Function
  },
  // ElTable 原生属性 END =======================================
  // ELPagination 原生属性 BEGIN ================================
  pSmall: {
    type: Boolean,
    default: false
  },
  pBackground: {
    type: Boolean,
    default: false
  },
  pPagerCount: {
    type: Number,
    default: 7
  },
  pLayout: {
    type: String,
    default: 'prev, pager, next, jumper, ->, total'
  },
  pPageSizes: {
    type: Array,
    default: () => {
      return [10, 20, 30, 40, 50, 100]
    }
  },
  pPopperClass: {
    type: String
  },
  pPrevText: {
    type: String
  },
  pNextText: {
    type: String
  },
  pDisabled: {
    type: Boolean,
    default: false
  },
  pHideOnSinglePage: {
    type: Boolean
  }
  // ELPagination 原生属性 END ==================================
}

export default props
