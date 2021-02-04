/**
 * 这个文件中存在的都是公开的方法
 */

export default {
  methods: {
    /**
     * 主动加载远程数据，一般发生在查询参数发生变化的时候
     * @param clear 是否清空数据以及重置分页(调用 clear 方法)
     * @return {methods}
     */
    load(clear = true) {
      clearTimeout(this._ajaxHandle)
      this._ajaxHandle = setTimeout(() => {
        this._loadRemoteData(() => {
          this.clear()
        }, clear)
      }, this.ajaxDelay)
      return this
    },
    /**
     * 取消尚未执行的ajax请求
     */
    cancel() {
      clearTimeout(this._ajaxHandle)
      return this
    },
    /**
     * 清空数据，并重置分页
     */
    clear() {
      this.data.cache = []
      this.data.view = []
      this.data.selection = []
      this.data.extra = null
      this.data.count = 0
      this.pager.index = 1
      this.pager.count = 0

      // 清空选中项
      this.$emit('input', [])

      if (this.autoResetScroll) {
        this.resetScroll()
      }

      return this
    },
    /**
     * 获取数据信息
     * @return {{pageIndex: number,pageCount: number,pageSize: number,dataSize: number, viewSize: number, selected: number}}
     */
    info() {
      return this.slotData
    },
    /**
     * 向表格尾追加数据项
     * @param row
     */
    append(row) {
      let rowCount
      if (Array.isArray(row)) {
        rowCount = row.length
        this.data.cache = this.data.cache.concat(row)
      } else {
        rowCount = 1
        this.data.cache.push(row)
      }
      this.data.count += rowCount
      this.pager.count = Math.ceil(this.data.count / this.pager.size)
      this.data.view = this.data.cache
      return this
    },
    /**
     * 向表格头追加数据项
     * @param row
     */
    prepend(row) {
      let rowCount
      if (Array.isArray(row)) {
        rowCount = row.length
        this.data.cache = row.concat(this.data.cache)
      } else {
        rowCount = 1
        this.data.cache.unshift(row)
      }
      this.data.count += rowCount
      this.pager.count = Math.ceil(this.data.count / this.pager.size)
      this.data.view = this.data.cache
      return this
    },
    /**
     * 向表格指定位置追加数据项
     * @param row 要插入的数据项或数组
     * @param index
     */
    insert(row, index) {
      let rowCount
      if (Array.isArray(row)) {
        rowCount = row.length
        Array.prototype.splice.apply(this.data.cache, [index, 0].concat(row))
      } else {
        rowCount = 1
        this.data.cache.splice(index, 0, row)
      }
      this.data.count += rowCount
      this.pager.count = Math.ceil(this.data.count / this.pager.size)
      this.data.view = this.data.cache
      return this
    },
    /**
     * 从数据缓存中移除数据项
     * @param rows
     */
    remove(rows) {
      if (!Array.isArray(rows)) {
        rows = [rows]
      }
      let removeRowCount = 0
      rows.forEach(row => {
        let id = this.getRowId(row)
        let idx = this.data.cache.findIndex(row => this.getRowId(row) === id)
        if (idx >= 0) {
          this.data.cache.splice(idx, 1)
          removeRowCount++
        }
      })
      this.doNotEmitSelectionEvent = true
      this.deselect(rows)
      this.doNotEmitSelectionEvent = false
      this.data.count -= removeRowCount
      this.pager.count = Math.ceil(this.data.count / this.pager.size)
      this.data.view = this.data.cache
      return this
    },
    /**
     * 从数据缓存中更新数据项
     * @param rows
     */
    update(rows) {
      if (!Array.isArray(rows)) {
        rows = [rows]
      }
      let temp = {}
      rows.forEach(row => {
        temp[this.getRowId(row)] = row
      })

      let remain = rows.length
      for (let i = 0; i < this.data.cache.length; i++) {
        let row = this.data.cache[i]
        let id = this.getRowId(row)
        if (!temp.hasOwnProperty(id)) {
          continue
        }
        this.$set(this.data.cache, i, temp[id])
        delete temp[id]
        remain--
        if (remain <= 0) {
          break
        }
      }
      return this
    },
    /**
     * 根配置的 idField 读取数据项的 id
     * @param row
     * @param idField
     * @return {String}
     */
    getRowId(row, idField) {
      if (row === undefined || row === null) {
        return undefined
      }

      // 当其值是字符串或数字时，默认其传入了 id
      if (typeof row === 'string' || typeof row === 'number') {
        return row.toString()
      }

      idField = idField || this.idField
      if (typeof idField === 'function') {
        return String(idField(row))
      }
      if (!Array.isArray(idField)) {
        if (!row.hasOwnProperty(idField)) {
          this._throwError(`Field "${idField}" not found in data row, a valid "id-field" property is expected`)
        }
        return String(row[idField])
      }
      let temp = row
      idField.forEach(field => {
        if (!temp.hasOwnProperty(field)) {
          this._throwError(`Field "${idField.join('.')}" not found in data row, a valid "id-field" property is expected`)
        }
        temp = temp[field]
      })
      return String(temp)
    },
    /**
     * 选中指定行
     * @param rows
     */
    select(rows) {
      // 单选
      if (!this.isMultipleSelection) {
        this.$refs.table.setCurrentRow(rows)
        return
      }
      // 多选
      if (!Array.isArray(rows)) {
        rows = [rows]
      }
      rows.forEach(row => {
        this.$refs.table.toggleRowSelection(row, true)
      })
      return this
    },
    /**
     * 全选，仅多选时有效
     * @return {[]} 选中的数据项
     */
    selectAll() {
      if (!this.isMultipleSelection) {
        this._throwError('Method "selectAll" only allowed for multiple selection')
      }
      let data = this.advanceSelection ? this.data.cache : this.currentData
      this.select(data)
      return data
    },
    /**
     *
     * @param rows 单选时此参数无效
     */
    deselect(rows) {
      if (!this.isMultipleSelection) {
        this.$refs.table.setCurrentRow()
        return
      }
      if (!Array.isArray(rows)) {
        rows = [rows]
      }
      rows.forEach(row => {
        this.$refs.table.toggleRowSelection(row, false)
      })
      return this
    },
    /**
     * 取消全选，仅多选时有效
     * @return {[]} 取消选中的数据项
     */
    deselectAll() {
      if (!this.isMultipleSelection) {
        this._throwError('Method "deselectAll" only allowed for multiple selection')
      }
      let data = this.advanceSelection ? this.data.cache : this.currentData
      this.deselect(data)
      return data
    },
    /**
     * 切换行的选择状态，仅多选时有效
     * @param rows
     */
    toggle(rows) {
      if (!this.isMultipleSelection) {
        this._throwError('Method "toggle" only allowed for multiple selection')
      }

      if (!rows) {
        return this
      }

      if (!Array.isArray(rows)) {
        rows = [rows]
      }
      rows.forEach(row => {
        this.$refs.table.toggleRowSelection(row)
      })
      return this
    },
    /**
     * 获取选中行
     * @return {*[]|*}
     */
    getSelection() {
      if (this.isMultipleSelection) {
        return this.data.selection.slice(0)
      }
      return this.data.selection[0]
    },
    /**
     * 清除所有选中项
     */
    clearSelection() {
      if (!this.data.selection.length) {
        return this
      }
      if (this.isMultipleSelection) {
        this.$refs.table.clearSelection()
      } else {
        this.$refs.table.setCurrentRow()
      }
      return this
    },
    clearSort() {
      this.$refs.table.clearSort()
      return this
    },
    clearFilter(columnKey) {
      this.$refs.table.clearFilter(columnKey)
      return this
    },
    doLayout() {
      this.$refs.table.doLayout()
      return this
    },
    sort(prop, order) {
      this.$refs.table.sort(prop, order)
      return this
    }
  }
}
