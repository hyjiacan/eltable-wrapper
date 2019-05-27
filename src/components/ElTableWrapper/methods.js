/**
 * 这个文件中存在的都是公开的方法
 */

const methods = {
  load () {
    this._loadRemoteData()
    return this
  },
  /**
   * 清空数据，并重置分页
   */
  clear () {
    this.data.view = this.data.cache = []
    this.data.extra = null
    this.pager.index = 1
    return this
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
    this.data.view = this.data.cache
    this.data.size = this.data.cache.length
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
    this.data.view = this.data.cache
    this.data.size = this.data.cache.length
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
   * @return {*}
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
      this.$refs.table.setCurrentRow(rows)
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
      console.log(all, current)
      // this.$refs.table.toggleRowSelection(row, true)
    })
  },
  deselect (rows) {
    if (!this.isMultipleSelection) {

    }
    if (!Array.isArray(rows)) {
      rows = [rows]
    }
    if (Array.isArray(rows)) {
      rows.forEach(row => {
        this.$refs.table.toggleRowSelection(row, false)
      })
    } else {
      this.$refs.table.setCurrentRow(rows)
    }
  },
  getSelection () {
    console.log(this.selection.all)
    if (this.isMultipleSelection) {
      return [].concat(this.selection.cache)
    }
    return this.selection.cache[0]
  },
  /**
   * 清除所有选中项
   */
  clearSelection () {
    if (this.isMultipleSelection) {
      this.$refs.table.clearSelection()
    } else {
      this.$refs.table.setCurrentRow()
    }
  },
  clearSort () {
    this.$refs.table.clearSort()
  }
}

export default methods
