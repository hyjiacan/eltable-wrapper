export default {
  data() {
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
         * 选中数据存放
         */
        selection: [],
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
        count: 0,
        loading: false,
        _ajaxHandle: -1
      },
      /**
       * 标记是否可以触发选中事件
       */
      doNotEmitSelectionEvent: false,
      pager: {
        /**
         * 每页显示的数据量
         */
        size: 10,
        /**
         * 页码
         */
        index: 1,
        /**
         * 总页数
         */
        count: 0,
        indexChanged: false
      },
      _ajaxParamsBuffer: null,
      _ajaxParamsDiff: [],
      _loadingInstance: null
    }
  }
}
