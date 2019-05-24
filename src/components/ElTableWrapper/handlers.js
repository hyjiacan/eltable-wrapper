/**
 * 事件处理集合
 * @type {{}}
 */
const handlers = {
  onPageChanged (index) {
    this.pager.indexChanged = true
    if (this.source === 'i' && index === this.pager.count) {
      // 当显示到最后一页时，加载更多数据
      this._loadIncData()
    }
    if (this.pager.index === index) {
      return
    }

    this.pager.index = index
    this.$emit('update:index', index)

    if (this.selection.cache.length) {
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
          this.$refs.table.setCurrentRow(cache[0])
        }
        this.$nextTick(() => {
          this.selection.ignore = false
        })
      })
    }
  },
  onSizeChanged (size) {
    if (this.pager.size === size) {
      return
    }
    this.pager.size = size
    this.$emit('update:size', size)
  },
  onTableSelectionChanged (selection, prev) {
    if (this.selection.ignore) {
      // 忽略由程序触发的事件
      return
    }
    if (!this.isMultipleSelection) {
      if (this.pager.indexChanged) {
        this.selection.current = {}
        this.pager.indexChanged = false
        // 高级选择时，切换页面不触发取消选择事件
        if (this.advanceSelection && this.selection.cache.length) {
          return
        }

        // 如果没有开启高级选择模式，那么在切换页面时，清空选中项
        this.selection.cache = []
        this.selection.all = {}
      }
      // 单选模式
      this.selection.all = this.selection.current = {
        [this.getDataId(selection)]: selection
      }
      this.selection.cache = [selection]
      this.$emit('select', selection, prev)
      return
    }
    // 多选模式

    // 若选中项不是数组，表示仅仅点击了行
    // 不作处理
    if (!Array.isArray(selection)) {
      return
    }

    // 是取消选中项(unselect)了还是选中项(select)了
    let currentPageSelectedLength = Object.keys(this.selection.current).length
    let type = currentPageSelectedLength < selection.length ? 'select' : 'unselect'
    if (this.pager.indexChanged) {
      this.selection.current = {}
      this.pager.indexChanged = false
      // 高级选择时，切换页面不触发取消选择事件
      if (this.advanceSelection) {
        if (type === 'unselect' && currentPageSelectedLength > 0) {
          // 当前页有选中时才阻止这个事件
          // 否则会导致页面跳转后选中事件无效
          return
        }
      } else {
        // 如果没有开启高级选择模式，那么在切换页面时，清空选中项
        this.selection.cache = []
        this.selection.all = {}
      }
    }

    let items = []
    let current = this.selection.current
    if (type === 'select') {
      // 需要找出新选中的项
      selection.forEach(row => {
        let id = this.getDataId(row)
        if (current.hasOwnProperty(id)) {
          return
        }
        // 这项就是新选中的了
        current[id] = row
        items.push(row)
      })
      // 更新选中集合
      this.selection.cache = this.selection.cache.concat(items)
    } else {
      // 需要找出取消选中的项
      // 找到一项，删除一项，最后剩下的就是被取消选中的项了
      let temp = Object.assign({}, current)
      selection.forEach(row => {
        let id = this.getDataId(row)
        if (temp.hasOwnProperty(id)) {
          delete temp[id]
        }
      })

      // 剩下的这项就是取消选中的了
      for (let id in temp) {
        if (!temp.hasOwnProperty(id)) {
          continue
        }
        items.push(temp[id])
        delete current[id]
        delete this.selection.all[id]
        // 更新选中集合
        let idx = this.selection.cache.findIndex(row => this.getDataId(row) === id)
        this.selection.cache.splice(idx, 1)
      }
    }
    if (!items.length) {
      // 如果没有变化的项，就忽略
      return
    }
    // 触发事件
    this.$emit('selection-change', [].concat(this.selection.cache), type, items)
  }
}

export default handlers
