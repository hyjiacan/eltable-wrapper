import props from './props'

const component = {
  name: 'ElTableWrapper',
  props,
  data () {
    return {
      /**
       * 数据
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
        view: []
      },
      pager: {
        size: 10,
        sizes: [10, 20, 30, 40, 50, 100],
        index: 1
      },
      /**
       * 标记是否还有更多的数据，当客户端分页时使用
       */
      hasMoreData: true,
      /**
       * 当还有更多数据的时候，存放多查询出的那一条数据
       */
      extraItem: null
    }
  },
  methods: {
    onPageChanged (index) {
      this.pager.index = index
      this.$emit('update:index', index)
    },
    onSizeChanged (size) {
      this.pager.size = size
      this.$emit('update:size', size)
    },
    init () {
      if (this.index) {
        this.pager.index = parseInt(this.index)
      }
      if (this.size) {
        this.pager.size = parseInt(this.size)
      }
      if (this.sizes) {
        this.pager.sizes = this.sizes
      }
    },
    /**
     * 清空数据，并重置分页
     */
    clear () {

    }
  },
  watch: {
    index (v) {
      this.pager.index = v
    },
    size (v) {
      this.pager.size = v
    }
  },
  mounted () {
    console.log(this)
    this.init()
    if (this.useLocalData) {
      this.data.view = this.data.cache = this.local
    } else {
      this.$emit('load', {})
    }
  },
  computed: {
    pageCount () {
      return Math.ceil(this.local.length / this.pager.size)
    },
    /**
     * 当前页显示的数据项
     */
    currentData () {
      if (!this.data.view.length) {
        return []
      }
      let from = (this.pager.index - 1) * this.pager.size
      return this.data.view.slice(from, from + this.pager.size)
    },
    useLocalData () {
      return !!this.local
    }
  }
}

export default component
