export default {
  methods: {
    __init() {
      this._ajaxParamsBuffer = {
        ...this.ajaxParams
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
      const available = ['top', 'bottom', 'both']
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
     * @param {Function} [beforeSend] 发送前的处理函数
     * @param {boolean} [newQuery=false] 是否是新查询
     * @private
     */
    _loadRemoteData(beforeSend, newQuery) {
      // 禁用了分页，不传分页的相关参数
      if (this.pDisabled) {
        this._loadDataWithoutPagination(beforeSend)
        return
      }
      if (this.type === 'i') {
        this._loadIncData(beforeSend, newQuery ? this.defaultId : undefined)
        return
      }

      if (this.type === 's') {
        this._loadPagedData(beforeSend, newQuery)
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
      this.data.loading = true
      this.$emit('update:loading', true)

      return new Promise(resolve => {
        this.ajax({
          url: this.url,
          method: this.method,
          [this.ajaxParamsName]: params,
          option: this.ajaxOptions
        }).then(response => {
          resolve(response)
        }).catch(e => {
          this.$emit('ajax-error', e)
        }).finally(() => {
          this.data.loading = false
          this.$emit('update:loading', false)
        })
      })
    },
    /**
     * 加载服务器返回的增量数据
     * @param {function} [beforeSend]
     * @param {string|number} [lastId]
     * @private
     */
    _loadIncData(beforeSend, lastId) {
      // 这么写以避免搞掉原始参数
      let p = {
        ...this.ajaxParams,
        [this.paramInc]: lastId === undefined ? this._getLastId() : lastId,
        [this.paramSize]: this.incSize
      }
      p = this._invokeCheckParams(p)
      if (p === false) {
        return
      }
      if (beforeSend) {
        beforeSend()
      }
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
      }).catch(() => {
        this.data.view = []
      })
    },
    /**
     * 加载服务器分页好的数据
     * @private
     */
    _loadPagedData(beforeSend, newQuery) {
      // 这么写以避免搞掉原始参数
      let p = {
        ...this.ajaxParams,
        [this.paramIndex]: newQuery ? 0 : this.pager.index - 1,
        [this.paramSize]: this.pager.size
      }
      p = this._invokeCheckParams(p)
      if (p === false) {
        return
      }
      if (beforeSend) {
        beforeSend()
      }
      this._sendAjax(p).then(data => {
        data = this._invokeResponseHandler(data)
        this.data.count = data[this.totalField]
        this.data.view = this.data.cache = data[this.listField] || []
        this._updatePageCount()
        this._updateSelection()
      }).catch(() => {
        this.data.view = this.data.cache = []
      })
    },
    /**
     * 加载数据（不带分页参数）
     * @private
     */
    _loadDataWithoutPagination(beforeSend) {
      // 这么写以避免搞掉原始参数
      let p = {
        ...this.ajaxParams
      }
      p = this._invokeCheckParams(p)
      if (p === false) {
        return
      }
      if (beforeSend) {
        beforeSend()
      }
      this._sendAjax(p).then(data => {
        data = this._invokeResponseHandler(data)
        if (Array.isArray(data)) {
          // 数据是数组
          this.data.count = data.length
          this.data.view = this.data.cache = data
        } else {
          // 数据是对象
          this.data.count = data[this.totalField]
          this.data.view = this.data.cache = data[this.listField] || []
        }
      }).catch(() => {
        this.data.view = this.data.cache = []
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
      const paramsDiff = this._ajaxParamsDiff || []
      if (paramsDiff.length) {
        // 重置变化的参数
        this._ajaxParamsDiff = []
      }
      const result = this.checkParams(param, paramsDiff)
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
      const data = this.data.extra
      if (!data) {
        return this.defaultId
      }
      return this.getRowId(data, this.incIdField)
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
      if (!this.data.selection.length) {
        return
      }
      const selectedRows = []
      this.doNotEmitSelectionEvent = true
      this.$nextTick(() => {
        // 设置选中项
        const selection = this.data.selection
        if (this.isMultipleSelection) {
          this.$refs.table.clearSelection()
          // 要使用当前 currentData 中的数据来设置为选中
          // 不能使用 data.selection 中的数据
          // 猜测：ElTable 中可能会判断对象的引用
          // 而不仅仅是 data id
          // 从而导致数据相同但引用不同时，选中的数据发生了变化
          // 也就是，ElTable 实际选中的数据，是 selection 中的对象，而不是 currentData 中的对象
          this.currentData.forEach(row => {
            // 仅选中当前页的数据
            const id = this.getRowId(row)
            const selected = this.data.selection.some(item => this.getRowId(item) === id)
            this.$refs.table.toggleRowSelection(row, selected)
            this._updateCheckField(row, selected)
            if (selected) {
              selectedRows.push(row)
            }
          })
        } else {
          // 选中一行就行了
          if (selection.length) {
            this.$refs.table.setCurrentRow(selection[0])
          } else {
            this.$refs.table.setCurrentRow()
          }
        }
        this.$nextTick(() => {
          this.doNotEmitSelectionEvent = false

          if (this.isMultipleSelection) {
            this.onTableSelectionChanged(selectedRows)
          }
        })
      })
    },
    _updateLocalData(data) {
      // 更新时，先清空数据
      this.clear()
      if (data && data.length) {
        this.append(this.localData)
      }
    },
    _updateCheckField(row, checked) {
      if (this.checkField) {
        this.$set(row, this.checkField, checked)
      }
    }
  }
}

/**
 *
 * @param {Array} array
 * @param {Function} indicator
 */
export function remove(array, indicator) {
  const index = array.findIndex(indicator)
  if (index >= -1) {
    array.splice(index, 1)
  }
}
