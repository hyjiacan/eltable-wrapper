export default {
  data() {
    return {
      cache: [],
      localData: [],
      params: {
        ignoreField: '',
        triggerField: ''
      },
      singleSelect: null,
      selection: []
    }
  },
  mounted() {
    let data = []

    for (let i = 0; i < 99; i++) {
      data.push({
        id: i,
        name: 'name' + i,
        dept: 'dept' + i,
        remark: 'remark' + i,
        __checked__: false
      })
    }
    this.localData = data
  },
  watch: {
    selection(v) {
      // console.info('selection changed', v)
    }
  },
  methods: {
    onSelect(selection, prev) {
      // eslint-disable-next-line
      // console.log(selection, prev)
    },
    selectionChanged(e) {
      // eslint-disable-next-line
      // console.log(e.selection, e.type, e.changed, e.allSelected)
    },
    onCheckParams(params, changed) {
      // 找出忽略的字段
      let hit = changed.filter(item => item.path[0] === 'ignoreField')
      // 如果只有忽略字段变化了，就不触发
      if (changed.length === 1 && hit.length) {
        return false
      }
      return params
    },
    toggleSelection() {
      this.$refs.table.toggle(this.localData.slice(0, 3))
    },
    onCheckAllChange({target}) {
      if (target.checked) {
        this.$refs.table.selectAll()
      } else {
        this.$refs.table.deselectAll()
      }
    },
    onRemoveRow() {
      if (!this.selection || !this.selection.length) {
        alert('没有选择行')
        return
      }

      const ids = this.selection.map(item => item.id)

      if (confirm(`确定要移除选中行吗？ ID: ${ids}`)) {
        this.$refs.table.remove(ids)
      }
    }
  }
}
