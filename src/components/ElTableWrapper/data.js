const data = () => {
  return {
    /**
     * 表格数据
     */
    data: {
      /**
       * 所有数据的缓存
       */
      cache: [],
      /**
       * 所有可用数据，比如过滤后的数据
       * 客户端分页时，每一页的数据都是直接从这个里面取的
       */
      view: [],
      /**
       * 当还有更多数据的时候，存放多查询出的那一条数据
       */
      extra: null,
      /**
       * 所有缓存的数据量
       */
      size: 0
    },
    /**
     * 选中数据的存放
     */
    selection: {
      /**
       * 当前页选中的数据集合
       */
      current: {},
      /**
       * 高级选择时所有选中的数据集合
       */
      all: {},
      /**
       * 所有选中的数据项，按选中顺序存放
       */
      cache: [],
      ignore: false
    },
    pager: {
      size: 10,
      sizes: [10, 20, 30, 40, 50, 100],
      index: 1,
      count: 0,
      indexChanged: false
    }
  }
}

export default data
