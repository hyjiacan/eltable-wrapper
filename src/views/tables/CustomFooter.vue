<template>
  <div class="splitter">
    <div id="footer-target">
      <div class="tip">footer被挂载到这里了</div>
    </div>
    <el-table-wrapper
      type="l"
      ref="table"
      :local-data="localData"
      pager-position="both"
      footer-target="#footer-target"
    >
      <el-table-column type="selection" prop="checked"></el-table-column>
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column label="Name" prop="name"></el-table-column>
      <el-table-column label="Dept." prop="dept"></el-table-column>
      <el-table-column label="Remark" prop="remark"></el-table-column>
    </el-table-wrapper>
  </div>
</template>

<script>
import tableMixin from './table.mixin'

export default {
  mixins: [tableMixin]
}
</script>

<style scoped>

</style>
