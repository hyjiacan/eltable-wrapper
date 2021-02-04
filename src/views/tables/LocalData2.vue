<template>
  <el-table-wrapper
    type="l"
    :local-data="localData"
    selection="multiple"
    pager-position="both"
    t-row-class-name="customize-row-class"
    t-highlight-current-row
    toggle-on-row-click
    check-field="__checked__"
    ref="table"
    @select="onSelect"
  >
    <template v-slot:pagerPrepend>
      <button @click="toggleSelection">切换前三行的选中状态</button>
    </template>
    <template v-slot:footer="{data}">
      <label>
        <input type="checkbox" style="vertical-align: -2px" @change="onCheckAllChange"
               :checked="data.viewSize === data.selected"/>
        <span>全选</span>
      </label>
      <span style="margin-left: 5px">已选择 {{ data.selected }} 项</span>
    </template>
    <el-table-column type="selection"/>
    <el-table-column label="ID" prop="id">
      <template v-slot="{row}">
        <span>{{ row.id }}</span>
        <span v-if="row.__checked__" style="color: red;">(选中)</span>
      </template>
    </el-table-column>
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
