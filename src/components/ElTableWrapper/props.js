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
  /**
   * 向服务器请求数据的url
   */
  ajaxUrl: {
    type: String
  },
  /**
   * 向服务器请求数据的method
   */
  ajaxMethod: {
    type: String,
    default: 'get'
  },
  /**
   * 向服务器请求数据的参数
   */
  ajaxParams: {
    type: Object
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
  // AJAX END===========================================================

  // 分页 BEGIN======================================================
  /**
   * 每页显示的数据量
   */
  size: {
    type: Number,
    default: 10
  },
  /**
   * 默认显示的页码
   */
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
  // 分页 END======================================================

  // 增量 BEGIN======================================================
  /**
   * 增量分页时每次向服务器请求的数据量
   */
  incSize: {
    type: Number,
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
  /**
   * ElTable 原始的属性与事件集合
   * 不支持以下项:
   */
  tableOption: {
    type: Object,
    default: () => {
      return {
        '@cell-mouse-enter': () => {
        },
        '@cell-mouse-leave': () => {
        },
        '@cell-click': () => {
        },
        '@cell-dblclick': () => {
        },
        '@row-click': () => {
        },
        '@row-contextmenu': () => {
        },
        '@row-dblclick': () => {
        },
        '@header-click': () => {
        },
        '@header-contextmenu': () => {
        },
        '@sort-change': () => {
        },
        '@filter-change': () => {
        },
        '@header-dragend': () => {
        },
        '@expand-change': () => {
        }
      }
    }
  },
  /**
   * ElPagination 原始的属性与事件集合
   * 不支持以下项:
   */
  pagerOption: {
    type: Object,
    default: () => {
    }
  }
}

export default props
