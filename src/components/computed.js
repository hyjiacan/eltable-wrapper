export default {
  computed: {
    /**
     * 附加的样式类
     */
    wrapperClass() {
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
    headerStyle() {
      let style = {
        height: this.headerVisible ? `${parseFloat(this.headerSize)}px` : 0
      }
      if (this.tBorder) {
        style.borderBottomWidth = 0
      }
      return style
    },
    contentStyle() {
      return {
        top: this.headerVisible ? `${parseFloat(this.headerSize)}px` : 0,
        bottom: this.footerVisible ? `${parseFloat(this.footerSize)}px` : 0
      }
    },
    footerStyle() {
      return {
        height: this.footerVisible ? `${parseFloat(this.footerSize)}px` : 0
      }
    },
    headerVisible() {
      return (!this.pDisabled && this.pagerPosition !== 'bottom') || this.$slots.header
    },
    footerVisible() {
      return this.showFooter || this.$slots.footer || (!this.pDisabled && this.pagerPosition !== 'top')
    },
    /**
     * 当前页显示的数据项
     */
    currentData() {
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
        // 服务器分页时，重新加载数据
        return this.data.view
      }
      let from = (this.pager.index - 1) * this.pager.size
      return this.data.view.slice(from, from + this.pager.size)
    },
    incIdField() {
      if (!this.incId) {
        return null
      }
      if (Array.isArray(this.incId)) {
        return this.incId
      }
      return [this.incId]
    },
    ajaxParamsName() {
      // 根据不同的请求设置参数: axios 用法
      // PUT POST PATCH 设置 data
      // 其它设置 params
      return /^(put|post|patch)$/.test(this.method) ? 'data' : 'params'
    },
    isMultipleSelection() {
      if (!this.$slots.default) {
        return this.selection === 'multiple'
      }
      // 循环列 查找多选列
      let selectionCol = this.$slots.default.every(node => {
        return !node.componentOptions ||
          !node.componentOptions.propsData ||
          node.componentOptions.propsData.type !== 'selection'
      })
      return !selectionCol || this.selection === 'multiple'
    },
    slotData() {
      let i = this
      return {
        pageIndex: i.pager.index,
        pageCount: i.pager.count,
        pageSize: i.pager.size,
        dataSize: i.data.count,
        viewSize: i.currentData.length,
        selected: i.selectionData.cache.length
      }
    },
    ajaxOptions() {
      const options = {
        ...this.ajaxOption
      }
      for (const attr in this.$attrs) {
        if (!this.$attrs.hasOwnProperty(attr)) {
          continue
        }
        // 仅需要 ajax-option- 开头的项
        const match = /^ajax-option-(?<name>.+)$/.exec(attr)
        if (!match) {
          continue
        }
        options[match.groups.name] = this.$attrs[attr]
      }
      return options
    }
  }
}
