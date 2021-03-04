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
      // 不需要使用 ElTable 保存选择状态
      // 这个状态目前已经在此组件中实现了
      if (!this.advanceSelection) {
        this.clearSelection()
      }

      this.pager.index = index
      this.$emit('update:index', index)
      this.$emit('page-index-change', index)
      if (this.type === 's') {
        this._loadPagedData()
      } else {
        this._updateSelection()
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
      // 如果是多选模式
      if (this.isMultipleSelection) {
        return
      }

      // 单选模式
      this.data.selection = selected ? [selected] : []

      if (this.doNotEmitSelectionEvent) {
        // 忽略由程序触发的事件
        return
      }
      this.$emit('select', selected, prev)
      this.$emit('input', selected)
    },
    onTableSelectionChanged(selection) {
      // 未启用多选
      if (!this.isMultipleSelection) {
        return
      }

      if (this.doNotEmitSelectionEvent) {
        return
      }

      if (this.advanceSelection && this.pager.indexChanged) {
        // 切换页面不触发取消选择事件
        this.pager.indexChanged = false
        return
      }

      // 获取当前页数据的 ID 集合，用于判断选中项状态
      const currentPageIds = this.currentData.map(row => this.getRowId(row))
      // 获取当前页的选中项的 ID 集合
      const currentPageSelectionIds = selection.map(row => this.getRowId(row))

      // 先移除未选中的项
      // 即此项已经在 data.selection 中，但当前的参数 selection 中不包含
      // 但要将数据限制在当前页面的数据 currentData
      // 移除数据太麻烦，不如重新创建数组来得方便

      // 要保留选中状态的行
      const selectedRows = []
      // const unselectedRows = []
      const unselectedIds = []
      this.data.selection.forEach(row => {
        const id = this.getRowId(row)
        // 只处理当前页的数据
        // 其它的选中项，直接追加上
        if (currentPageIds.indexOf(id) === -1) {
          selectedRows.push(row)
          return
        }
        // 当前行是否选中
        // 那么就保留此行
        if (currentPageSelectionIds.indexOf(id) !== -1) {
          selectedRows.push(row)
        } else {
          // console.log(id, false)
          // this._updateCheckField(row, false)
          // unselectedRows.push(row)
          unselectedIds.push(id)
        }
      })

      let i = 0
      this.data.cache.forEach(row => {
        if (unselectedIds.some(id => this.getRowId(row) === id)) {
          this._updateCheckField(row, false)
          i++
        }
        if (i === unselectedIds.length) {
          return false
        }
      })

      // 再添加新选中的项
      selection.forEach(row => {
        const id = this.getRowId(row)
        if (this.data.selection.some(item => this.getRowId(item) === id)) {
          return
        }
        selectedRows.push(row)
        this._updateCheckField(row, true)
        this.data.selection.push(row)
      })

      this.data.selection = selectedRows

      // 是否选择了所有数据项
      const allSelected = this.data.selection.length > 0 &&
        this.data.selection.length === this.data.cache.length

      this.$emit('input', selectedRows)
      this.$emit('selection-change', {
        selection: selectedRows,
        allSelected
      })
    },
    onRowClick() {
      // 拦截点击事件
      if (this.rowClickInterceptor) {
        const intercept = this.rowClickInterceptor(...arguments)
        if (intercept === false) {
          return
        }
      }
      // 在多选时，支持单击以选中行
      if (this.isMultipleSelection && this.toggleOnRowClick) {
        this.toggle(arguments[0])
      }
      if (!this.$listeners['row-click']) {
        return
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
    }
  }
}
