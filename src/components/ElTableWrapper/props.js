const props = {
  url: {
    type: String
  },
  method: {
    type: String,
    default: 'get'
  },
  preHandler: {
    type: Function
  },
  /**
   * 每页显示的数据量
   */
  size: {
    type: [String, Number],
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
    type: [String, Number],
    default: 1
  },
  /**
   * 是否自动调整高度，否则撑满整个容器
   */
  autoHeight: {
    type: Boolean,
    default: false
  },
  /**
   * 是否禁用分页
   */
  disablePager: {
    type: Boolean,
    default: false
  },
  // 本地数据，为空时表示不使用本地数据
  local: {
    type: Array
  },
  tableOptions: {
    type: Object,
    required: true
  },
  pagerOptions: {
    type: Object,
    required: false
  },
  type: {
    type: String,
    default: 's'
  }
}

export default props
