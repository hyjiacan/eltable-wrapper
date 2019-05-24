const props = {
  // 通用 BEGIN===========================================================
  /**
   * 数据源类型，可选值: l(local), i(increment), s(server)
   */
  source: {
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
  // 通用 END===========================================================

  // AJAX BEGIN===========================================================
  /**
   * 发送异步请求的方法，需要返回 Promise 对象
   */
  ajax: {
    type: Function
  },
  ajaxUrl: {
    type: String
  },
  ajaxMethod: {
    type: String,
    default: 'get'
  },
  ajaxParams: {
    type: Object
  },
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
  totalField: {
    type: String,
    default: 'total'
  },
  listField: {
    type: String,
    default: 'list'
  },
  // AJAX END===========================================================

  // 增量 BEGIN======================================================
  /**
   * 在使用增量加载数据时，每次从服务器加载的数据量
   */
  increaseSize: {
    type: Number,
    default: 80
  },
  /**
   * 增量加载数据时，增量参数名
   */
  increaseParam: {
    type: String,
    default: 'lastId'
  },
  /**
   * 增量加载数据时，数据项的标识字段，若标识不在顶层，则使用数组传递
   * 未指定时，使用 idField 的值
   */
  increaseId: {
    type: [String, Array]
  },
  // 增量 END======================================================

  // 分页 BEGIN======================================================
  /**
   * 每页显示的数据量
   */
  size: {
    type: Number,
    default: 10
  },
  /**
   * 分页列表
   */
  sizes: {
    type: [Array, Boolean],
    default: () => [10, 20, 50, 100]
  },
  index: {
    type: Number,
    default: 1
  },
  /**
   * 是否禁用分页
   */
  disablePager: {
    type: Boolean,
    default: false
  },
  // 分页 BEGIN======================================================
  tableOptions: {
    type: Object,
    required: true
  },
  pagerOptions: {
    type: Object,
    required: false
  }
  // 分页 END========================================================
}

export default props
