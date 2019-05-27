import props from './props'
import methods from './methods'
import handlers from './handlers'
import data from './data'

const component = {
  name: 'ElTableWrapper',
  props,
  data,
  methods: {
    init () {
      if (this.index) {
        this.pager.index = parseInt(this.index)
      }
      if (this.pageSize) {
        this.pager.size = parseInt(this.pageSize)
      }
    },
    checkProps () {
      if (this.source === 'l') {
        // 本地数据
        return
      }
      // 使用远程数据时，必须指定 dataLoader
      if (!this.ajax) {
        throw new Error('ElTableWrapper: Property "ajax" must be specified while source is not "l"(local)')
      }
      // 使用远程数据时，必须指定 url
      if (!this.ajaxUrl) {
        throw new Error('ElTableWrapper: Property "ajax-url" must be specified while source is not "l"(local)')
      }
    },
    _loadRemoteData () {
      if (this.source === 'i') {
        this._loadIncData()
        return
      }

      if (this.source === 's') {
        this._loadPagedData()
        return
      }

      console.warn('ElTableWrapper: "load" method not allowed while source is "l"(local)')
    },
    /**
     * 发送 ajax 请求
     * @private
     */
    _sendAjax (params) {
      return this.ajax({
        url: this.ajaxUrl,
        method: this.ajaxMethod,
        [this.ajaxParamsName]: params
      })
    },
    /**
     * 加载服务器返回的增量数据
     * @private
     */
    _loadIncData () {
      this._sendAjax({
        // 这么写以避免搞掉原始参数
        ...this.ajaxParams,
        [this.paramInc]: this._getLastId(),
        [this.paramSize]: this.incSize
      }).then(data => {
        if (data.length <= this.incSize) {
          this.append(data)
          this.data.extra = null
          this._updatePageCount()
          return
        }
        // 还有更多数据
        this.data.extra = data[this.incSize]
        this.append(data.slice(0, this.incSize))
        this._updatePageCount()
        if (this.pager.index !== 1 || this.pager.count !== 1) {
          return
        }
        // 渲染后触发一次分页事件
        this.$nextTick(() => {
          this.onPageChanged(this.pager.index)
        })
      }).catch(e => {
        console.error(e)
      })
    },
    /**
     * 加载服务器分页好的数据
     * @private
     */
    _loadPagedData () {
      this._sendAjax({
        // 这么写以避免搞掉原始参数
        ...this.ajaxParams,
        [this.paramIndex]: this.data.extra,
        [this.paramSize]: this.pager.size
      }).then(data => {
        data.size = data[this.totalField]
        this.data.view = this.data.cache = data[this.listField]
        this._updatePageCount()
      }).catch(e => {
        console.error(e)
      })
    },
    _getLastId () {
      let data = this.data.extra
      if (!data) {
        return ''
      }
      return this.getDataId(data, this.incIdField)
    },
    _updatePageCount () {
      let length = 0
      switch (this.source) {
        case 's':
          length = this.data.size
          break
        case 'i':
        case 'l':
          length = this.data.view.length
          break
      }
      if (!length) {
        return 0
      }
      this.pager.count = Math.ceil(length / this.pager.size)
    },
    ...handlers,
    ...methods
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
    this.init()
    this.checkProps()
    if (this.autoLoad) {
      this._loadRemoteData()
    }
  },
  computed: {
    /**
     * 当前页显示的数据项
     */
    currentData () {
      if (!this.data.view.length) {
        return []
      }
      // 如果禁用分页，直接显示所有数据
      if (this.pDisabled) {
        return this.data.view
      }
      // 如果指定的页码比总页数小，那么显示最后一页
      if (this.pager.index > this.pager.count) {
        this.pager.index = this.pager.count
      }
      let from = (this.pager.index - 1) * this.pager.size
      return this.data.view.slice(from, from + this.pager.size)
    },
    incIdField () {
      if (!this.incId) {
        return null
      }
      if (Array.isArray(this.incId)) {
        return this.incId
      }
      return [this.incId]
    },
    ajaxParamsName () {
      // 根据不同的请求设置参数
      // PUT POST PATCH 设置 data
      // 其它设置 params
      return /^(put|post|patch)$/.test(this.method) ? 'data' : 'params'
    },
    isMultipleSelection () {
      // 循环列 查找多选列
      let selectionCol = this.$slots.default.filter(node => {
        return node.componentOptions.propsData.type === 'selection'
      })
      return !!selectionCol.length
    }
  }
}

export default component
