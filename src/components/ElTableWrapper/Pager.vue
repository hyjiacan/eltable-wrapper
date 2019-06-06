<template>
  <div class="el-table-wrapper-pager">
    <div class="el-table-wrapper-pager-prepend">
      <slot name="pagerPrepend" :data="slotData"></slot>
    </div>
    <template v-if="parent.showPagerSummary">
      <span class="el-table-wrapper-pager-summary">
        <slot name="pagerSummary" :data="slotData">
          <template v-if="parent.loading">正在加载...</template>
          <template v-else-if="parent.type === 'i' && parent.data.extra">已加载 {{parent.data.size}} 条数据</template>
          <template v-else>共 {{parent.data.size}} 条数据</template>
        </slot>
      </span>
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
    <div class="el-table-wrapper-pager-append">
      <slot name="pagerAppend" :data="slotData">
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pager',
  props: {
    position: {
      type: String,
      required: true
    }
  },
  inject: ['parent'],
  computed: {
    slotData () {
      return {
        ...this.parent.slotData,
        position: this.position
      }
    }
  }
}
</script>

<style scoped>

</style>
