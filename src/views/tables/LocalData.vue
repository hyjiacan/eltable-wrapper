<template>
  <el-table-wrapper
    type="l"
    :local-data="localData"
    selection="single"
    pager-position="both"
    t-row-class-name="customize-row-class"
    t-highlight-current-row
    v-model="selection"
    @selection-change="selectionChanged"
    @select="onSelect"
    advance-selection
    ref="table"
  >
    <template v-slot:pagerPrepend>
      <div style="float: right">
        <span>这个表格使用了 <code>advance-selection</code>，支持跨页选择</span>
        <button @click="onShowSelection">在console查看选中数据</button>
        <button @click="onRemoveRow">通行ID移除选中行</button>
      </div>
    </template>
    <el-table-column type="selection"/>
    <el-table-column label="ID" prop="id"></el-table-column>
    <el-table-column label="Name" prop="name"></el-table-column>
    <el-table-column label="Dept." prop="dept"></el-table-column>
    <el-table-column label="Remark">
      <template v-slot="{row}">
        {{ row.remark }}
      </template>
    </el-table-column>
  </el-table-wrapper>
</template>

<script>
import tableMixin from './table.mixin'

export default {
  mixins: [tableMixin],
  methods: {
    onShowSelection() {
      console.info(JSON.stringify(this.$refs.table.getSelection(), null, 2))
    }
  }
}
</script>

<style scoped>

</style>
