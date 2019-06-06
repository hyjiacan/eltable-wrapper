import equal from 'deep-equal'
import props from './props'
import methods from './methods'
import handlers from './handlers'
import data from './data'

const component = {
  props,
  data,
  methods: {
    __init () {
      this._ajaxParamsBuffer = {
        ...this.params
      }
      if (this.index) {
        this.pager.index = parseInt(this.index)
        if (this.pager.index < 1 || isNaN(this.pager.index)) {
          this.pager.index = 1
        }
      }
      if (this.pageSize) {
        this.pager.size = parseInt(this.pageSize)
      }
    },
    _throwError (msg) {
      throw new Error(`ElTableWrapper: ${msg}`)
    },
    /**
     * 检查传入的属性是否合法
     * @private
     */
    _checkProps () {
      if (isNaN(this.index)) {
        this._throwError('Invalid value for property "index", numeric required')
      }
      if (this.index < 1) {
        this._throwError('Invalid value for property "index", expected equals or great than "1"')
      }
      // 检查pager-position
      let available = ['top', 'bottom', 'both']
      if (available.indexOf(this.pagerPosition) === -1) {
        this._throwError('Invalid value for property "pager-position", available are: ' + available.join(','))
      }
      if (this.type === 'l') {
        // 本地数据
        return
      }
      // 使用远程数据时，必须指定 dataLoader
      if (!this.ajax) {
        this._throwError('Property "ajax" must be specified while type is not "l"(local)')
      }
      // 使用远程数据时，必须指定 url
      if (!this.url) {
        this._throwError('Property "url" must be specified while type is not "l"(local)')
      }
    },
    _loadRemoteData () {
      if (this.type === 'i') {
        this._loadIncData()
        return
      }

      if (this.type === 's') {
        this._loadPagedData()
        return
      }
      // eslint-disable-next-line
      this._throwError('"load" method not allowed while type is "l"(local)')
    },
    /**
     * 发送 ajax 请求
     * @private
     */
    _sendAjax (params) {
      return this.ajax({
        url: this.url,
        method: this.method,
        [this.ajaxParamsName]: params
      })
    },
    /**
     * 加载服务器返回的增量数据
     * @private
     */
    _loadIncData () {
      // 这么写以避免搞掉原始参数
      let p = {
        ...this.params,
        [this.paramInc]: this._getLastId(),
        [this.paramSize]: this.incSize
      }
      p = this._invokeCheckParams(p)
      if (p === false) {
        return
      }
      this.data.loading = true
      this.$emit('update:loading', true)
      this._sendAjax(p).then(data => {
        data = this._invokeResponseHandler(data)
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
        if (this.type === 'i') {
          // 当只有一页数据时，加载更多数据
          this.$nextTick(() => {
            this._loadIncData()
          })
        }
      }).catch(e => {
        this.$emit('ajax-error', e)
      }).finally(() => {
        this.data.loading = false
        this.$emit('update:loading', false)
      })
    },
    /**
     * 加载服务器分页好的数据
     * @private
     */
    _loadPagedData () {
      // 这么写以避免搞掉原始参数
      let p = {
        ...this.params,
        [this.paramIndex]: this.pager.index - 1,
        [this.paramSize]: this.pager.size
      }
      p = this._invokeCheckParams(p)
      if (p === false) {
        return
      }
      this.data.loading = true
      this.$emit('update:loading', true)
      this._sendAjax(p).then(data => {
        data = this._invokeResponseHandler(data)
        this.data.size = data[this.totalField]
        this.data.view = this.data.cache = data[this.listField] || []
        this._updatePageCount()
      }).catch(e => {
        this.$emit('ajax-error', e)
      }).finally(() => {
        this.data.loading = false
        this.$emit('update:loading', false)
      })
    },
    _invokeResponseHandler (data) {
      if (this.responseHandler) {
        return this.responseHandler(data)
      }
      return data
    },
    _invokeCheckParams (param) {
      if (this.checkParams) {
        return this.checkParams(param)
      }
      return param
    },
    _getLastId () {
      let data = this.data.extra
      if (!data) {
        return this.defaultId
      }
      return this.getDataId(data, this.incIdField)
    },
    _updatePageCount () {
      let length = 0
      switch (this.type) {
        case 's':
          length = this.data.size
          break
        case 'i':
        case 'l':
          length = this.data.view.length
          break
      }
      if (!length) {
        this.pager.count = 0
      }
      this.pager.count = Math.ceil(length / this.pager.size)
      this.$emit('data-size-change', length)
    },
    _updateSelection () {
      if (!this.selection.cache.length) {
        return
      }
      this.selection.ignore = true
      this.$nextTick(() => {
        // 设置选中项
        let cache = this.selection.cache
        if (this.isMultipleSelection) {
          cache.forEach(row => {
            this.$refs.table.toggleRowSelection(row, true)
          })
        } else {
          // 选中一行就行了
          if (cache.length) {
            this.$refs.table.setCurrentRow(cache[0])
          } else {
            this.$refs.table.setCurrentRow()
          }
        }
        this.$nextTick(() => {
          this.selection.ignore = false
        })
      })
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
    },
    currentData () {
      this._updateSelection()
    },
    params (v) {
      // 检查两个对象是否相同
      if (this.loadWhenParamsChange && !equal(this._ajaxParamsBuffer, v)) {
        this.load()
      }

      this._ajaxParamsBuffer = {
        ...this.params
      }
    },
    loading (v) {
      this.data.loading = v
    }
  },
  mounted () {
    this.__init()
    this._checkProps()
    if (this.type !== 'l' && this.autoLoad) {
      this._loadRemoteData()
    }
  },
  computed: {
    /**
     * 附加的样式类
     */
    wrapperClass () {
      let cls = {
        'el-table-wrapper-auto-height': this.autoHeight,
        'el-table-wrapper-header-visible': this.headerVisible,
        'el-table-wrapper-footer-visible': this.footerVisible
      }
      if (this.customClass) {
        cls[this.customClass] = true
      }
      return cls
    },
    headerStyle () {
      return {
        height: this.headerVisible ? `${parseFloat(this.headerSize)}px` : 0
      }
    },
    contentStyle () {
      return {
        top: this.headerVisible ? `${parseFloat(this.headerSize)}px` : 0,
        bottom: this.footerVisible ? `${parseFloat(this.footerSize)}px` : 0
      }
    },
    footerStyle () {
      return {
        height: this.footerVisible ? `${parseFloat(this.footerSize)}px` : 0
      }
    },
    headerVisible () {
      return (!this.pDisabled && this.pagerPosition !== 'bottom') || this.$slots.header
    },
    footerVisible () {
      return (!this.pDisabled && this.pagerPosition !== 'top') || this.$slots.footer
    },
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
      if (this.type === 's') {
        // 服务器分页时，直接返回数据
        return this.data.view
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
      // 根据不同的请求设置参数: axios 用法
      // PUT POST PATCH 设置 data
      // 其它设置 params
      return /^(put|post|patch)$/.test(this.method) ? 'data' : 'params'
    },
    isMultipleSelection () {
      if (!this.$slots.default) {
        return this.multiSelection
      }
      // 循环列 查找多选列
      let selectionCol = this.$slots.default.every(node => {
        return !node.componentOptions ||
          !node.componentOptions.propsData ||
          node.componentOptions.propsData.type !== 'selection'
      })
      return !!selectionCol.length || this.multiSelection
    },
    slotData () {
      let i = this
      return {
        pageIndex: i.pager.index,
        pageCount: i.pager.count,
        pageSize: i.pager.size,
        dataSize: i.data.size,
        selected: i.selection.cache.length
      }
    }
  }
}

export default component
