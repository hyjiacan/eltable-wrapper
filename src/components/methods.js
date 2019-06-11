/**
 * 这个文件中存在的都是公开的方法
 */

const methods = {
  /**
   * 主动加载远程数据，一般发生在查询参数发生变化的时候
   * @param clear 是否清空数据以及重置分页(调用 clear 方法)
   * @return {methods}
   */
  load (clear = true) {
    this.clear()
    this._loadRemoteData()
    return this
  },
  /**
   * 清空数据，并重置分页
   */
  clear () {
    this.data.view = this.data.cache = []
    this.data.extra = null
    this.data.size = 0
    this.pager.index = 1
    this.pager.count = 0
    this.selection.cache = []
    this.selection.all = {}
    this.selection.current = {}
    return this
  },
  /**
   * 获取数据信息
   * @return {number}
   */
  info () {
    return {
      pageIndex: this.pager.index,
      pageCount: this.pager.count,
      pageSize: this.pager.size,
      dataSize: this.data.size,
      selected: this.selection.cache.length
    }
  },
  /**
   * 向表格尾追加数据项
   * @param row
   */
  append (row) {
    if (Array.isArray(row)) {
      this.data.cache = this.data.cache.concat(row)
    } else {
      this.data.cache.push(row)
    }
    this.data.size = this.data.cache.length
    this.pager.count = Math.ceil(this.data.size / this.pager.size)
    this.data.view = this.data.cache
    return this
  },
  /**
   * 向表格头追加数据项
   * @param row
   */
  prepend (row) {
    if (Array.isArray(row)) {
      this.data.cache = row.concat(this.data.cache)
    } else {
      this.data.cache.unshift(row)
    }
    this.data.size = this.data.cache.length
    this.pager.count = Math.ceil(this.data.size / this.pager.size)
    this.data.view = this.data.cache
    return this
  },
  /**
   * 向表格指定位置追加数据项
   * @param row 要插入的数据项或数组
   * @param index
   */
  insert (row, index) {
    if (Array.isArray(row)) {
      [].splice.apply(this.data.cache, [index, 0].concat(row))
    } else {
      this.data.cache.splice(index, 0, row)
    }
    this.data.size = this.data.cache.length
    this.pager.count = Math.ceil(this.data.size / this.pager.size)
    this.data.view = this.data.cache
    return this
  },
  /**
   * 从数据缓存中移除数据项
   * @param rows
   */
  remove (rows) {
    if (!Array.isArray(rows)) {
      rows = [rows]
    }
    rows.forEach(row => {
      let id = this.getDataId(row)
      let idx = this.data.cache.findIndex(row => this.getDataId(row) === id)
      this.data.cache.splice(idx, 1)
      idx = this.selection.cache.findIndex(row => this.getDataId(row) === id)
      this.selection.cache.splice(idx, 1)
    })
    this.data.size = this.data.cache.length
    this.pager.count = Math.ceil(this.data.size / this.pager.size)
    this.data.view = this.data.cache
    return this
  },
  /**
   * 从数据缓存中更新数据项
   * @param rows
   */
  update (rows) {
    if (!Array.isArray(rows)) {
      rows = [rows]
    }
    let temp = {}
    rows.forEach(row => {
      temp[this.getDataId(row)] = row
    })

    let remain = rows.length
    for (let i = 0; i < this.data.cache.length; i++) {
      let row = this.data.cache[i]
      let id = this.getDataId(row)
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
  getDataId (row, idField) {
    idField = idField || this.idField
    if (typeof idField === 'function') {
      return idField(row)
    }
    if (!Array.isArray(idField)) {
      return row[idField]
    }
    let temp = row
    idField.forEach(field => {
      temp = temp[field]
    })
    return temp
  },
  /**
   * 选中指定行
   * @param rows
   */
  select (rows) {
    let all = this.selection.all
    let current = this.selection.current
    let cache = this.selection.cache
    // 单选
    if (!this.isMultipleSelection) {
      let id = this.getDataId(rows)
      this.selection.all = this.selection.current = {
        [id]: rows
      }
      this._updateSelection()
      return
    }
    // 多选
    if (!Array.isArray(rows)) {
      rows = [rows]
    }
    rows.forEach(row => {
      let id = this.getDataId(row)
      if (!all.hasOwnProperty(id)) {
        all[id] = row
        current[id] = row
        cache.push(row)
      }
    })
    this._updateSelection()
    return this
  },
  /**
   * 全选，仅多选时有效
   * @return 选中的数据项
   */
  selectAll () {
    if (!this.isMultipleSelection) {
      console.warn('ElTableWrapper: method "selectAll" only allowed for multiple selection')
      return []
    }
    let data = this.advanceSelection ? this.data.cache : this.currentData
    this.select(data)
    return data
  },
  /**
   *
   * @param rows 单选时此参数无效
   */
  deselect (rows) {
    if (!this.isMultipleSelection) {
      this.selection.all = this.selection.current = {}
      this.selection.cache = []
      this._updateSelection()
      return
    }
    if (!Array.isArray(rows)) {
      rows = [rows]
    }
    let all = this.selection.all
    let current = this.selection.current
    let cache = this.selection.cache
    this.selection.ignore = true
    rows.forEach(row => {
      let id = this.getDataId(row)
      if (all.hasOwnProperty(id)) {
        delete all[id]
        delete current[id]
        let idx = cache.findIndex(row => this.getDataId(row) === id)
        cache.splice(idx, 1)
      }
      this.$refs.table.toggleRowSelection(row, false)
    })
    this.selection.ignore = false
    return this
  },
  /**
   * 取消全选，仅多选时有效
   * @return 取消选中的数据项
   */
  deselectAll () {
    if (!this.isMultipleSelection) {
      console.warn('ElTableWrapper: method "deselectAll" only allowed for multiple selection')
      return []
    }
    let data = this.advanceSelection ? this.data.cache : this.currentData
    this.deselect(data)
    return data
  },
  /**
   * 获取选中行
   * @return {*[]|*}
   */
  getSelection () {
    if (this.isMultipleSelection) {
      return [].concat(this.selection.cache)
    }
    return this.selection.cache[0]
  },
  /**
   * 清除所有选中项
   */
  clearSelection () {
    if (!this.selection.cache.length) {
      return this
    }
    if (this.isMultipleSelection) {
      this.$refs.table.clearSelection()
    } else {
      this.$refs.table.setCurrentRow()
    }
    return this
  },
  clearSort () {
    this.$refs.table.clearSort()
    return this
  },
  clearFilter (columnKey) {
    this.$refs.table.clearFilter(columnKey)
    return this
  },
  doLayout () {
    this.$refs.table.doLayout()
    return this
  },
  sort (prop, order) {
    this.$refs.table.sort(prop, order)
    return this
  }
}

export default methods
