import diff from 'deep-diff'

export default {
  watch: {
    index(v) {
      this.pager.index = v
    },
    size(v) {
      this.pager.size = v
    },
    currentData() {
      this._updateSelection()
    },
    params: {
      deep: true,
      handler(v) {
        if (this.type === 'l') {
          return
        }
        // 检查两个对象是否相同
        this._ajaxParamsDiff = diff(this._ajaxParamsBuffer, v) || []
        if (this.loadWhenParamsChange && this._ajaxParamsDiff.length) {
          this.load()
        }
        if (this._ajaxParamsDiff.length) {
          this._ajaxParamsBuffer = {
            ...this.ajaxParams
          }
        }
      }
    },
    loading(v) {
      this.data.loading = v
    },
    localData(data) {
      this._updateLocalData(data)
    },
    'data.cache'(v) {
      this.$emit('data-size-change', v.length)
    }
  }
}
