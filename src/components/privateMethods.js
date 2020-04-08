export default {
  methods: {
    __init() {
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
    _throwError(msg) {
      throw new Error(`ElTableWrapper: ${msg}`)
    },
    /**
     * 检查传入的属性是否合法
     * @private
     */
    _checkProps() {
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
    /**
     *
     * @param {Function} beforeSend 发送前的处理函数
     * @private
     */
    _loadRemoteData(beforeSend) {
      if (this.type === 'i') {
        this._loadIncData(beforeSend)
        return
      }

      if (this.type === 's') {
        this._loadPagedData(beforeSend)
        return
      }
      // eslint-disable-next-line
      this._throwError('"load" method not allowed while type is "l"(local)')
    },
    /**
     * 发送 ajax 请求
     * @private
     */
    _sendAjax(params) {
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
    _loadIncData(beforeSend) {
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
      if (beforeSend) {
        beforeSend()
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
    _loadPagedData(beforeSend) {
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
      if (beforeSend) {
        beforeSend()
      }
      this.data.loading = true
      this.$emit('update:loading', true)
      this._sendAjax(p).then(data => {
        data = this._invokeResponseHandler(data)
        this.data.count = data[this.totalField]
        this.data.view = this.data.cache = data[this.listField] || []
        this._updatePageCount()
      }).catch(e => {
        this.$emit('ajax-error', e)
      }).finally(() => {
        this.data.loading = false
        this.$emit('update:loading', false)
      })
    },
    _invokeResponseHandler(data) {
      if (this.responseHandler) {
        return this.responseHandler(data)
      }
      return data
    },
    _invokeCheckParams(param) {
      if (!this.checkParams) {
        return param
      }
      let paramsDiff = this._ajaxParamsDiff || []
      if (paramsDiff.length) {
        // 重置变化的参数
        this._ajaxParamsDiff = []
      }
      let result = this.checkParams(param, paramsDiff)
      // 返回 false 时表示阻止执行
      if (result === false) {
        return false
      }
      // 返回 true 或 undefined 时表示使用原参数继续执行
      if (result === true || result === undefined) {
        return param
      }
      // 返回其它类型时，直接作为参数返回
      return result
    },
    _getLastId() {
      let data = this.data.extra
      if (!data) {
        return this.defaultId
      }
      return this.getDataId(data, this.incIdField)
    },
    _updatePageCount() {
      let length = 0
      switch (this.type) {
        case 's':
          length = this.data.count
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
    _updateSelection() {
      if (!this.selectionData.cache.length) {
        return
      }
      this.selectionData.ignore = true
      this.$nextTick(() => {
        // 设置选中项
        let cache = this.selectionData.cache
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
          this.selectionData.ignore = false
        })
      })
    },
    _updateLocalData(data) {
      // 更新时，先清空数据
      this.clear()
      if (data && data.length) {
        this.append(this.localData)
      }
    }
  }
}
