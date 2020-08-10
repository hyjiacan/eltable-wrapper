/**
 * 事件处理集合
 * @type {{}}
 */
export default {
  methods: {
    resetScroll() {
      if (this.autoHeight) {
        const mark = this.$el.querySelector('.el-table-wrapper-top-mark')
        if (mark) {
          mark.scrollIntoView()
        }
        return
      }
      const wrapper = this.$el.querySelector('.el-table__body-wrapper')
      if (wrapper) {
        wrapper.scrollTop = 0
      }
    },
    onPageChanged(index) {
      this.pager.indexChanged = true
      if (this.data.extra && this.type === 'i' && index === this.pager.count) {
        // 当显示到最后一页时，加载更多数据
        this.$nextTick(() => {
          this._loadIncData()
        })
      }
      if (this.pager.index === index) {
        return
      }
      this.pager.index = index
      this.$emit('update:index', index)
      this.$emit('page-index-change', index)
      if (this.type === 's') {
        this._loadPagedData()
      }
      if (this.autoResetScroll) {
        this.resetScroll()
      }
    },
    onSizeChanged(size) {
      if (this.pager.size === size) {
        return
      }
      this.$emit('update:size', size)
      this.$emit('page-size-change', size)

      this.pager.size = size
      this._updatePageCount()

      if (this.type === 's') {
        // 服务器分页时需要重新加载数据
        this.load()
      }
      if (this.autoResetScroll) {
        this.resetScroll()
      }
    },
    onTableCurrentRowChanged(selected, prev) {
      // 未启用单选
      if (this.selection !== 'single') {
        return
      }
      if (this.selectionData.ignore) {
        // 忽略由程序触发的事件
        return
      }
      // 如果是多选模式
      if (this.isMultipleSelection) {
        return
      }
      if (this.pager.indexChanged) {
        this.selectionData.current = {}
        this.pager.indexChanged = false
        // 高级选择时，切换页面不触发取消选择事件
        if (this.advanceSelection && this.selectionData.cache.length) {
          return
        }

        // 如果没有开启高级选择模式，那么在切换页面时，清空选中项
        this.selectionData.cache = []
        this.selectionData.all = {}
      }
      // 单选模式
      this.selectionData.all = this.selectionData.current = {
        [this.getDataId(selected)]: selected
      }
      this.selectionData.cache = [selected]
      this.$emit('select', selected, prev)
      this.$emit('input', selected)
    },
    onTableSelectionChanged(selection) {
      // 未启用多选
      if (!this.isMultipleSelection) {
        return
      }

      // 设置数据的选中字段
      if (this.checkField) {
        const idSet = []
        selection.forEach(row => {
          idSet.push(this.getDataId(row))
        })
        this.data.cache.forEach(row => {
          this._updateCheckField(row, idSet.indexOf(this.getDataId(row)) !== -1)
        })
      }

      if (this.selectionData.ignore) {
        // 忽略由程序触发的事件
        return
      }
      // 是取消选中项(deselect)了还是选中项(select)了
      const currentPageSelectedLength = Object.keys(this.selectionData.current).length
      const type = currentPageSelectedLength < selection.length ? 'select' : 'deselect'
      if (this.pager.indexChanged) {
        this.selectionData.current = {}
        this.pager.indexChanged = false
        // 高级选择时，切换页面不触发取消选择事件
        if (this.advanceSelection) {
          if (type === 'deselect' && currentPageSelectedLength > 0) {
            // 当前页有选中时才阻止这个事件
            // 否则会导致页面跳转后选中事件无效
            return
          }
        } else {
          // 如果没有开启高级选择模式，那么在切换页面时，清空选中项
          this.selectionData.cache = []
          this.selectionData.all = {}
        }
      }

      const items = []
      const current = this.selectionData.current
      const all = this.selectionData.all
      if (type === 'select') {
        // 需要找出新选中的项
        selection.forEach(row => {
          const id = this.getDataId(row)
          if (current.hasOwnProperty(id)) {
            return
          }
          // 这项就是新选中的了
          current[id] = row
          if (all.hasOwnProperty(id)) {
            return
          }
          all[id] = row
          items.push(row)
        })
        // 更新选中集合
        this.selectionData.cache = this.selectionData.cache.concat(items)
      } else {
        // 需要找出取消选中的项
        // 找到一项，删除一项，最后剩下的就是被取消选中的项了
        const temp = Object.assign({}, current)
        selection.forEach(row => {
          const id = this.getDataId(row)
          if (temp.hasOwnProperty(id)) {
            delete temp[id]
          }
        })

        // 剩下的这项就是取消选中的了
        for (const id in temp) {
          if (!temp.hasOwnProperty(id)) {
            continue
          }
          items.push(temp[id])
          delete current[id]
          delete all[id]
          // 更新选中集合
          const idx = this.selectionData.cache.findIndex(row => this.getDataId(row) === id)
          if (idx >= 0) {
            this.selectionData.cache.splice(idx, 1)
          }
        }
      }
      if (!items.length) {
        // 如果没有变化的项，就忽略
        return
      }
      // 是否选择了所有数据项
      const allSelected = this.selectionData.cache.length > 0 && this.selectionData.cache.length === this.data.cache.length
      // 触发事件
      const e = {
        selection: this.getSelection(),
        type,
        changed: items,
        allSelected
      }
      this.$emit('input', e.selection)
      this.$emit('selection-change', e)
    },
    onCellMouseEnter() {
      const args = [].slice.apply(arguments)
      args.unshift('cell-mouse-enter')
      this.$emit.apply(this, args)
    },
    onCellMouseLeave() {
      const args = [].slice.apply(arguments)
      args.unshift('cell-mouse-leave')
      this.$emit.apply(this, args)
    },
    onCellClick() {
      const args = [].slice.apply(arguments)
      args.unshift('cell-click')
      this.$emit.apply(this, args)
    },
    onCellDblclick() {
      const args = [].slice.apply(arguments)
      args.unshift('cell-dblclick')
      this.$emit.apply(this, args)
    },
    onRowClick() {
      // 在多选时，支持单击以选中行
      if (this.isMultipleSelection && this.toggleOnRowClick) {
        this.toggle(arguments[0])
      }
      const args = [].slice.apply(arguments)
      args.unshift('row-click')
      this.$emit.apply(this, args)
    },
    onRowContextmenu() {
      const args = [].slice.apply(arguments)
      args.unshift('row-contextmenu')
      this.$emit.apply(this, args)
    },
    onRowDblclick() {
      const args = [].slice.apply(arguments)
      args.unshift('row-dblclick')
      this.$emit.apply(this, args)
    },
    onHeaderClick() {
      const args = [].slice.apply(arguments)
      args.unshift('header-click')
      this.$emit.apply(this, args)
    },
    onHeaderContextmenu() {
      const args = [].slice.apply(arguments)
      args.unshift('header-contextmenu')
      this.$emit.apply(this, args)
    },
    onSortChange() {
      const args = [].slice.apply(arguments)
      args.unshift('sort-change')
      this.$emit.apply(this, args)
    },
    onFilterChange() {
      const args = [].slice.apply(arguments)
      args.unshift('filter-change')
      this.$emit.apply(this, args)
    },
    onHeaderDragend() {
      const args = [].slice.apply(arguments)
      args.unshift('header-dragend')
      this.$emit.apply(this, args)
    },
    onExpandChange() {
      const args = [].slice.apply(arguments)
      args.unshift('expand-change')
      this.$emit.apply(this, args)
    }
  }
}
