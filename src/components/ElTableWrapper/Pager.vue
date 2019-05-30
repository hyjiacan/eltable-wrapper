<template>
  <div class="el-table-wrapper-pager">
    <div class="el-table-wrapper-pager-prepend" v-if="this.$slots.pagerPrepend">
      <slot name="pagerPrepend"></slot>
    </div>
    <template v-if="parent.showPagerSummary">
      <span class="el-table-wrapper-pager-summary" v-if="parent.source === 'i' && parent.data.extra">已加载 {{parent.data.size}} 条数据</span>
      <span class="el-table-wrapper-pager-summary" v-else>共 {{parent.data.size}} 条数据</span>
    </template>
    <el-pagination
      :page-size="parent.pager.size"
      :page-count="parent.pager.count"
      :current-page="parent.pager.index"
      :small="parent.pSmall"
      :background="parent.pBackground"
      :pagerCount="parent.pPagerCount"
      :layout="parent.pLayout"
      :pageSizes="parent.pPageSizes"
      :popperClass="parent.pPopperClass"
      :prevText="parent.pPrevText"
      :nextText="parent.pNextText"
      :disabled="parent.pDisabled"
      :hideOnSinglePage="parent.pHideOnSinglePage"
      @current-change="parent.onPageChanged"
      @size-change="parent.onSizeChanged">
    </el-pagination>
    <div class="el-table-wrapper-pager-append" v-if="this.$slots.pagerAppend">
      <slot name="pagerAppend"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pager',
  inject: ['parent']
}
</script>

<style scoped>

</style>
