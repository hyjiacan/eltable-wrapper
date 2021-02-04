<template>
  <el-table-wrapper
    type="l"
    :local-data="localData"
    pager-position="both"
    t-row-class-name="customize-row-class"
    t-highlight-current-row
    @select="onSelect"
    :show-footer="false"
    p-disabled
    selection="single"
    ref="table"
  >
    <template v-slot:titleToolbar="{data}">
      <span>{{ data }}</span>
      <button>自定义按钮</button>
      <button @click="$refs.table.deselect()">取消选中</button>
    </template>
<!--    <el-table-column type="selection"/>-->
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
  mixins: [tableMixin]
}
</script>

<style scoped>

</style>
